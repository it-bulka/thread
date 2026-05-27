'use server'
import { ICommunityDetailsRes, ICommunityRes, ISuggestedCommunity } from '@/types';
import { toPlain } from '@/lib/utils';
import { connectToDb } from '@/db/connectToDb';
import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import { Community, User, Thread } from '@/models';
import { handleError } from '@/lib/handleError';
import { Models } from '@/consts';


interface IFetchCommunities {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy: SortOrder
}
export const fetchCommunities = handleError(async ({ searchString = '', pageNumber = 1, pageSize = 1, sortBy = 'desc' }: IFetchCommunities): Promise<{
  communities: ICommunityRes[], totalAmount: number, page: number, totalPages: number
}>  => {
  await connectToDb()

  const skipAmount = (pageNumber - 1 ) * pageSize
  const regex = new RegExp(searchString, 'i')

  const query: FilterQuery<typeof Community> = {}

  if(searchString?.trim()) {
    query.$or = [
      { username: { $regex: regex } },
      { name:  { $regex: regex } },
    ]
  }

  const sortOption = { createdAt: sortBy }
  const communities: ICommunityRes[] = await Community.find(query).sort(sortOption).skip(skipAmount).limit(pageSize).populate('members').lean()
  const totalUsersAmount = await Community.countDocuments(query)
  const totalPages = Math.ceil(totalUsersAmount / pageSize)

  return { communities, totalAmount: totalUsersAmount, page: pageNumber, totalPages }
},
  () => 'Failed to fetch communities')


interface IFetchCommunityDetails {
  authOrganizationId: string
}
export const fetchCommunityDetails = handleError(async ({ authOrganizationId }: IFetchCommunityDetails): Promise<ICommunityDetailsRes> => {
  await connectToDb()
  const communityDetails = await Community.findOne({ authOrganizationId }).populate([
    'createdBy',
    {
      path: 'members',
      model: Models.USER,
      select: 'name username image _id authId',
    },
    {
      path: 'joinRequests',
      model: Models.USER,
      select: 'name username image _id authId',
    },
  ])
  return toPlain(communityDetails)
},
  () => 'Failed to fetch community details')


export interface ICreateCommunity {
  id: string
  name: string
  username: string
  image: string
  bio: string
  createdById: string
}
export const createCommunity = handleError(async ({ createdById, name, username, id, image, bio  }: ICreateCommunity): Promise<ICommunityRes> => {
  await connectToDb()
  const user = await User.findOne({ authId: createdById })
  if(!user) throw new Error('No user to create community')

  const newCommunity = await Community.create({
    authOrganizationId: id, name, username, image, bio, createdBy: user._id
  })

  /* communities id into user is added via webhook 'organizationMembership.created' */
  return newCommunity
},
  () => 'Failed to create community')


export interface IUpdateCommunityInfo {
  communityId: string
  name: string
  username: string
  image: string
}
export const updateCommunityInfo = handleError(async ({ communityId, name, username, image }: IUpdateCommunityInfo) => {
  await connectToDb()

  const updatedCommunity = await Community.findOneAndUpdate(
    { authOrganizationId: communityId },
    { name, username, image }
  );

  if (!updatedCommunity) throw new Error('Community not found')

  return updatedCommunity;
})


export const deleteCommunity = handleError(async (communityId: string): Promise<void> => {
  await connectToDb()

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedCommunity = await Community.findOneAndDelete(
      { authOrganizationId: communityId },
      { new: true }).session(session)

    if (!deletedCommunity) throw new Error('Community not found')

    await Thread.deleteMany({ community: deletedCommunity?._id }).session(session)

    await User.updateMany(
      { communities: deletedCommunity?._id },
      { $pull: { communities: deletedCommunity?._id }}
    ).session(session)

    await session.commitTransaction()
    await session.endSession()

    return deletedCommunity;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error
  }
})


export const fetchSuggestedCommunities = handleError(async (userAuthId: string): Promise<ISuggestedCommunity[]> => {
  await connectToDb()

  const user = await User.findOne({ authId: userAuthId }).select('_id')
  if (!user) return []

  const communities = await Community.find({
    members: { $nin: [user._id] },
    createdBy: { $ne: user._id },
  })
    .limit(5)
    .populate({ path: 'members', model: Models.USER, select: 'image' })
    .lean()

  return toPlain<ISuggestedCommunity[]>(communities)
},
  () => 'Failed to fetch suggested communities'
)
