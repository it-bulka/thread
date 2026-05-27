'use server'
import { connectToDb } from '@/db/connectToDb';
import { User } from '@/models';
import { IActivityItem, ILikedThread, IUserRes } from '@/types';
import { FilterQuery, SortOrder } from 'mongoose';
import { handleError } from '@/lib/handleError';
import Thread from '@/models/thread';
import { Models } from '@/consts';

interface IUserUpdate {
  authId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}
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

  const plainUser: IUserRes = user.toObject()
  return plainUser
},
  () => 'Failed to create/update user')


interface IUserDelete {
  userId: string;
}
export const deleteUser = handleError(async ({ userId }: IUserDelete): Promise<void>  => {
  await connectToDb()

  await User.deleteOne({ authId: userId })
},
  () => 'Failed to delete user')


export const fetchUser = handleError(async (userId: string): Promise<IUserRes | null>  => {
  await connectToDb()
  const userDoc = await User.findOne({ authId: userId }) ?? await User.findOne({ username: userId })
  return userDoc?.toObject() ?? null
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
    .populate({ path: 'author', model: Models.USER, select: 'name image authId' })
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
      .populate({ path: 'author', model: Models.USER, select: 'name image authId' })
      .populate({ path: 'community', model: Models.COMMUNITY, select: 'authOrganizationId name image' })
      .populate({ path: 'children', populate: { path: 'author', model: Models.USER, select: 'image' } })
      .populate({ path: 'likes', model: Models.USER, select: 'authId' })
      .lean(),
    Thread.countDocuments({ likes: user._id })
  ])

  const totalPages = Math.ceil(total / pageSize) || 1

  return { threads: threads as unknown as ILikedThread[], totalPages, page: pageNumber }
},
  () => 'Failed to fetch liked threads')
