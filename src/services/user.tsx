'use server'
import { connectToDb } from '@/db/connectToDb';
import { Community, User } from '@/models';
import { IActivityItem, ILikedThread, ISuggestedUser, IUserRes } from '@/types';
import { FilterQuery, SortOrder } from 'mongoose';
import { handleError } from '@/lib/handleError';
import Thread from '@/models/thread';
import { Models } from '@/consts';
import { toPlain } from '@/lib/utils';
import { UTApi } from 'uploadthing/server';

interface IUserUpdate {
  authId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  oldImage?: string;
}
interface IUserImageSync {
  authId: string;
  image: string;
}
export const syncUserImageFromClerk = handleError(async ({ authId, image }: IUserImageSync): Promise<void> => {
  await connectToDb()
  await User.findOneAndUpdate({ authId }, { image })
}, () => 'Failed to sync user image from Clerk')


export const updateUser = handleError(async (userData: IUserUpdate): Promise<IUserRes>  => {
  await connectToDb()
  const user = await User.findOneAndUpdate(
    { authId: userData.authId },
    {
      username: userData.username.toLowerCase(),
      name: userData.name,
      bio: userData.bio,
      image: userData.image,
      onboarded: true,
    },
    { upsert: true, new: true }
  )

  if (userData.oldImage?.includes('utfs.io')) {
    const fileKey = userData.oldImage.split('/f/')[1]
    if (fileKey) {
      await new UTApi().deleteFiles(fileKey).catch(console.error)
    }
  }

  return toPlain<IUserRes>(user)
},
  () => 'Failed to create/update user')


interface IUserDelete {
  userId: string;
}
export const deleteUser = handleError(async ({ userId }: IUserDelete): Promise<void> => {
  await connectToDb()

  const user = await User.findOne({ authId: userId })
  if (!user) return

  await User.findOneAndUpdate({ authId: userId }, {
    deleted: true,
    deletedAt: new Date(),
    name: 'Deleted Account',
    username: `deleted_${userId}`,
    image: '',
    bio: '',
  })

  await Community.updateMany(
    { $or: [{ members: user._id }, { joinRequests: user._id }] },
    { $pull: { members: user._id, joinRequests: user._id } }
  )

  await Thread.updateMany(
    { likes: user._id },
    { $pull: { likes: user._id } }
  )

  if (user.image?.includes('utfs.io')) {
    const fileKey = user.image.split('/f/')[1]
    if (fileKey) await new UTApi().deleteFiles(fileKey).catch(console.error)
  }

  // Handle communities where this user is the sole owner
  const ownedCommunities = await Community.find({ createdBy: user._id })
    .populate({ path: 'members', model: Models.USER, select: '_id deleted' })

  const { clerkClient } = await import('@clerk/nextjs/server')

  for (const community of ownedCommunities) {
    const activeMembers = (community.members as any[]).filter(
      (m: any) => !m.deleted && !m._id.equals(user._id)
    )

    if (activeMembers.length > 0) {
      await Community.findByIdAndUpdate(community._id, { createdBy: activeMembers[0]._id })
    } else {
      // No remaining members — delete via Clerk so organization.deleted webhook cleans DB
      const deleted = await clerkClient.organizations
        .deleteOrganization(community.authOrganizationId)
        .catch(() => null)

      // If Clerk org already gone, clean up DB directly
      if (!deleted) {
        const { deleteCommunity } = await import('@/services/communities')
        await deleteCommunity(community.authOrganizationId)
      }
    }
  }
}, () => 'Failed to delete user')


export const deleteCurrentUserAccount = handleError(async (authId: string): Promise<void> => {
  const { clerkClient } = await import('@clerk/nextjs/server')
  await clerkClient.users.deleteUser(authId)
}, () => 'Failed to delete account')


export const fetchUser = handleError(async (userId: string): Promise<IUserRes | null>  => {
  await connectToDb()
  const userDoc = await User.findOne({ authId: userId }) ?? await User.findOne({ username: userId })
  return userDoc ? toPlain<IUserRes>(userDoc) : null
},
  () => 'Failed to fetch user')

interface IFetchUsers {
  currentUserId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy: SortOrder
}
export const fetchUsers = handleError(async ({ currentUserId, searchString = '', pageNumber = 1, pageSize = 1, sortBy = 'desc' }: IFetchUsers): Promise<{
  users: IUserRes[], totalAmount: number, page: number, totalPages: number
}>  => {
  await connectToDb()

  const skipAmount = (pageNumber - 1 ) * pageSize
  const regex = new RegExp(searchString, 'i')

  const query: FilterQuery<typeof User> = {
    authId: { $ne: currentUserId}
  }

  if(searchString?.trim()) {
    query.$or = [
      { username: { $regex: regex } },
      { name:  { $regex: regex } },
    ]
  }

  const sortOption = { createdAt: sortBy }
  const users: IUserRes[] = await User.find(query).sort(sortOption).skip(skipAmount).limit(pageSize).lean()
  const totalUsersAmount = await User.countDocuments(query)
  const totalPages = Math.ceil(totalUsersAmount / pageSize)

  return { users, totalAmount: totalUsersAmount, page: pageNumber, totalPages }
},
() => 'Failed to fetch users')


export const getActivities = handleError(async (
  userId: string, pageNumber = 1, pageSize = 10
): Promise<{ activities: IActivityItem[], totalPages: number, page: number }> => {
  await connectToDb()

  const user = await User.findOne({ authId: userId })
  if (!user) throw 'User not found'

  const userThreads = await Thread.find({ author: user._id })
    .populate({ path: 'likes', model: Models.USER, select: 'name image authId' })
    .lean()

  const childIds = userThreads.flatMap((t: any) => t.children)
  const replies = await Thread.find({ _id: { $in: childIds } })
    .populate({ path: 'author', model: Models.USER, select: 'name image authId deleted' })
    .lean()

  const replyActivities: IActivityItem[] = replies
    .filter((r: any) => r.author.authId !== userId)
    .map((r: any) => ({
      type: 'reply' as const,
      user: r.author,
      threadId: r.parentId!.toString(),
      createdAt: r.createdAt.toISOString()
    }))

  const likeActivities: IActivityItem[] = userThreads
    .filter((t: any) => t.likes?.length > 0)
    .flatMap((t: any) =>
      (t.likes as any[])
        .filter((l: any) => l.authId !== userId)
        .map((l: any) => ({
          type: 'like' as const,
          user: l,
          threadId: t._id.toString(),
          createdAt: t.updatedAt.toISOString()
        }))
    )

  const all = [...replyActivities, ...likeActivities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalPages = Math.ceil(all.length / pageSize) || 1
  const activities = all.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

  return { activities, totalPages, page: pageNumber }
},
  () => 'Failed to fetch activities')


export const fetchSuggestedUsers = handleError(async (userAuthId: string): Promise<ISuggestedUser[]> => {
  await connectToDb()

  const count = await User.countDocuments({ authId: { $ne: userAuthId } })
  const randomSkip = Math.max(0, Math.floor(Math.random() * count) - 5)

  const users = await User
    .find({ authId: { $ne: userAuthId } })
    .select('authId name username image')
    .skip(randomSkip)
    .limit(5)
    .lean()

  return toPlain<ISuggestedUser[]>(users)
}, () => 'Failed to fetch suggested users')


export const getLikedThreads = handleError(async (
  userId: string, pageNumber = 1, pageSize = 10
): Promise<{ threads: ILikedThread[], totalPages: number, page: number }> => {
  await connectToDb()

  const user = await User.findOne({ authId: userId })
  if (!user) throw 'User not found'

  const skip = (pageNumber - 1) * pageSize

  const [threads, total] = await Promise.all([
    Thread.find({ likes: user._id })
      .skip(skip)
      .limit(pageSize)
      .populate({ path: 'author', model: Models.USER, select: 'name image authId username deleted' })
      .populate({ path: 'community', model: Models.COMMUNITY, select: 'authOrganizationId name image' })
      .populate({ path: 'children', populate: { path: 'author', model: Models.USER, select: 'image' } })
      .populate({ path: 'likes', model: Models.USER, select: 'authId' })
      .lean(),
    Thread.countDocuments({ likes: user._id })
  ])

  const totalPages = Math.ceil(total / pageSize) || 1

  return { threads: toPlain<ILikedThread[]>(threads), totalPages, page: pageNumber }
},
  () => 'Failed to fetch liked threads')
