'use server'
import { ICommunityAccessStatus, ICommunityRes } from '@/types';
import { toPlain } from '@/lib/utils';
import { connectToDb } from '@/db/connectToDb';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { Community, User } from '@/models';
import { handleError } from '@/lib/handleError';
import { revalidatePath } from 'next/cache';
import { clerkClient } from '@clerk/nextjs/server';


export interface IAddMemberToCommunity {
  communityId: string
  memberId: string
}
export const addMemberToCommunity = handleError(async ({ communityId, memberId }: IAddMemberToCommunity): Promise<ICommunityRes> => {
  await connectToDb()
  const community = await Community.findOne({ authOrganizationId: communityId });
  if (!community) throw new Error('Community not found')

  const user = await User.findOne({ authId: memberId });
  if (!user) throw new Error('User not found')

  if (community.members.includes(user._id)) return toPlain<ICommunityRes>(community)

  await Promise.all([
    Community.updateOne({ _id: community._id }, { $addToSet: { members: user._id } }),
    User.updateOne({ _id: user._id }, { $addToSet: { communities: community._id } }),
  ])

  return toPlain<ICommunityRes>(community);
},
  () => 'Failed to add member community')


export interface IDeleteMemberFromCommunity {
  communityId: string
  userId: string
}
export const deleteMemberFromCommunity = handleError(async ({ communityId, userId }: IDeleteMemberFromCommunity): Promise<void> => {
  await connectToDb()

  const [community, user] = await Promise.all([
    Community.findOne({ authOrganizationId: communityId }).select('_id'),
    User.findOne({ authId: userId }).select('_id'),
  ])

  if (!community) throw new Error('Community not found')
  if (!user) throw new Error('Member not found')

  await Promise.all([
    Community.updateOne({ _id: community._id }, { $pull: { members: user._id } }),
    User.updateOne({ _id: user._id }, { $pull: { communities: community._id } }),
  ])

  revalidatePath(`/communities/${communityId}`)
})


export const toggleCommunityPrivacy = handleError(
  async ({ communityAuthId }: { communityAuthId: string }): Promise<{ isPrivate: boolean }> => {
    await connectToDb()
    const community = await Community.findOne({ authOrganizationId: communityAuthId })
    if (!community) throw new Error('Community not found')

    community.isPrivate = !community.isPrivate
    await community.save()
    revalidatePath(`/communities/${communityAuthId}`)

    return { isPrivate: community.isPrivate }
  },
  () => 'Failed to toggle community privacy'
)


export const checkCommunityAccess = handleError(
  async ({ communityAuthId, userAuthId }: { communityAuthId: string; userAuthId: string })
    : Promise<ICommunityAccessStatus> => {
    await connectToDb()

    const [community, user] = await Promise.all([
      Community.findOne({ authOrganizationId: communityAuthId }).select('_id isPrivate members joinRequests'),
      User.findOne({ authId: userAuthId }).select('_id'),
    ])
    if (!community) throw new Error('Community not found')
    if (!user) throw new Error('User not found')

    const isMember = community.members.some((m: Types.ObjectId) => m.equals(user._id))
    const hasPendingRequest = community.joinRequests.some((r: Types.ObjectId) => r.equals(user._id))

    return { isPrivate: community.isPrivate, isMember, hasPendingRequest }
  },
  () => 'Failed to check community access'
)


export interface IManageRequest {
  communityId: string
  userId: string
}

export const requestToJoin = handleError(async ({ communityId, userId }: IManageRequest): Promise<void> => {
  await connectToDb()

  const [community, user] = await Promise.all([
    Community.findOne({ authOrganizationId: communityId }).select('_id isPrivate members joinRequests'),
    User.findOne({ authId: userId }).select('_id'),
  ])
  if (!community) throw new Error('Community not found')
  if (!user) throw new Error('User not found')

  const alreadyMember = community.members.some((m: mongoose.Types.ObjectId) => m.equals(user._id))
  if (alreadyMember) throw new Error('Already a member of this community')

  if (!community.isPrivate) {
    await Promise.all([
      Community.updateOne({ _id: community._id }, { $addToSet: { members: user._id } }),
      User.updateOne({ _id: user._id }, { $addToSet: { communities: community._id } }),
    ])
    await clerkClient.organizations.createOrganizationMembership({
      organizationId: communityId,
      userId,
      role: 'org:member',
    })
    revalidatePath(`/communities/${communityId}`)
    return
  }

  const alreadyRequested = community.joinRequests.some((r: mongoose.Types.ObjectId) => r.equals(user._id))
  if (alreadyRequested) throw new Error('Join request already pending')

  await Community.updateOne({ _id: community._id }, { $addToSet: { joinRequests: user._id } })
  revalidatePath(`/communities/${communityId}`)
},
  () => 'Failed to send join request')


export const approveRequest = handleError(async ({ communityId, userId }: IManageRequest): Promise<void> => {
  await connectToDb()

  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const community = await Community.findOne({ authOrganizationId: communityId }).select('_id').session(session)
    const user = await User.findOne({ authId: userId }).select('_id').session(session)

    if (!community) throw new Error('Community not found')
    if (!user) throw new Error('User not found')

    await Community.updateOne(
      { _id: community._id },
      { $pull: { joinRequests: user._id }, $addToSet: { members: user._id } }
    ).session(session)

    await User.updateOne(
      { _id: user._id },
      { $addToSet: { communities: community._id } }
    ).session(session)

    await session.commitTransaction()
    await session.endSession()

    await clerkClient.organizations.createOrganizationMembership({
      organizationId: communityId,
      userId,
      role: 'org:member',
    })

    revalidatePath(`/communities/${communityId}`)
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw err
  }
},
  () => 'Failed to approve request')


export const denyRequest = handleError(async ({ communityId, userId }: IManageRequest): Promise<void> => {
  await connectToDb()

  const community = await Community.findOne({ authOrganizationId: communityId }).select('_id')
  const user = await User.findOne({ authId: userId }).select('_id')

  if (!community) throw new Error('Community not found')
  if (!user) throw new Error('User not found')

  await Community.updateOne(
    { _id: community._id },
    { $pull: { joinRequests: user._id } }
  )

  revalidatePath(`/communities/${communityId}`)
},
  () => 'Failed to deny request')


export const cancelJoinRequest = handleError(async ({ communityId, userId }: IManageRequest): Promise<void> => {
  await connectToDb()

  const [community, user] = await Promise.all([
    Community.findOne({ authOrganizationId: communityId }).select('_id joinRequests'),
    User.findOne({ authId: userId }).select('_id'),
  ])
  if (!community) throw new Error('Community not found')
  if (!user) throw new Error('User not found')

  const hasPending = community.joinRequests.some((r: Types.ObjectId) => r.equals(user._id))
  if (!hasPending) throw new Error('No pending request found')

  await Community.updateOne({ _id: community._id }, { $pull: { joinRequests: user._id } })
  revalidatePath(`/communities/${communityId}`)
},
  () => 'Failed to cancel join request')


export const leaveCommunity = handleError(async ({ communityId, userId }: IDeleteMemberFromCommunity): Promise<void> => {
  await connectToDb()

  const [community, user] = await Promise.all([
    Community.findOne({ authOrganizationId: communityId }).select('_id'),
    User.findOne({ authId: userId }).select('_id'),
  ])
  if (!community) throw new Error('Community not found')
  if (!user) throw new Error('Member not found')

  await Promise.all([
    Community.updateOne({ _id: community._id }, { $pull: { members: user._id } }),
    User.updateOne({ _id: user._id }, { $pull: { communities: community._id } }),
  ])

  await clerkClient.organizations.deleteOrganizationMembership({
    organizationId: communityId,
    userId,
  })

  revalidatePath(`/communities/${communityId}`)
},
  () => 'Failed to leave community')
