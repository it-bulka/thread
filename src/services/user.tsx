'use server'
import { connectToDb } from '@/db/connectToDb';
import { User } from '@/models';
import { IUserRes } from '@/types';
import { FilterQuery, SortOrder } from 'mongoose';
import { handleError } from '@/lib/handleError';

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
  const userDoc = await User.findOne({ authId: userId })
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


export const getActivities = handleError(async () => {
    await connectToDb()
    const activities = await User.find()

    return
  },
  () => 'Failed to fetch activities')
