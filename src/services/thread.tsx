'use server'
import { Types } from 'mongoose';
import { ICommunityThreadsRes, ITaggedThreadsRes, IThreadRes, IThreadWithChildren, IUserRepliesRes, IUserWithThreadsRes } from '@/types';
import Thread, {IThread } from '@/models/thread';
import Community from '@/models/community';
import { connectToDb } from '@/db/connectToDb';
import { revalidatePath } from 'next/cache';
import { Models } from '@/consts';
import { User } from '@/models';
import { handleError } from '@/lib/handleError';
import { parseMentions } from '@/lib/parseMentions';

interface ICreateThread {
  text: string
  author: string
  communityId?: string
  path: string
}
export const createThread = handleError(async (param: ICreateThread): Promise<IThreadRes> => {
  await connectToDb()
  const user = await User.findOne({ authId: param.author })
  if(!user) throw 'user not found'

  const threadData: Partial<IThread> = {
    text: param.text,
    author: user._id,
  }

  let community
  if(param.communityId) {
    community = await Community.findOne({ authOrganizationId: param.communityId })
    if(!community) throw 'Community not found'

    threadData.community = community._id
  }

  const mentionedUsernames = parseMentions(param.text)
  if (mentionedUsernames.length > 0) {
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } }, { _id: 1 })
    threadData.taggedUsers = mentionedUsers.map(u => u._id)
  }

  const threadDoc = await Thread.create(threadData)
  const thread: IThreadRes = threadDoc.toObject()

  user.threads.push(threadDoc._id)
  await user.save()
  if(community) {
    community.threads.push(threadDoc._id)
    await community.save()
  }

  revalidatePath(param.path)

  return thread
},
  () => 'Failed to create thread')



interface IUpdateThread {
  threadId: string
  text: string
  author: string
  communityId: string | null
  path: string
}
export const updateThread = handleError(async (params: IUpdateThread): Promise<IThreadRes | null> => {
  const { threadId, text, author, communityId, path } = params
  await connectToDb()

  const community = communityId && await Community.findOne({ _id: new Types.ObjectId(communityId!)})

  const updatedField: Partial<IThread> = { text, author: new Types.ObjectId(author)}
  community?._id && (updatedField.community = community?._id )

  const mentionedUsernames = parseMentions(text)
  const mentionedUsers = mentionedUsernames.length > 0
    ? await User.find({ username: { $in: mentionedUsernames } }, { _id: 1 })
    : []
  updatedField.taggedUsers = mentionedUsers.map(u => u._id)

  const threadDoc = await Thread.findOneAndUpdate(
    { _id: new Types.ObjectId(threadId) },
    updatedField,
    { new: true }
  )
  const thread: IThreadRes | null = threadDoc?.toObject() || null
  return thread
},
() => 'Failed to update thread')



export const deleteThread = handleError(async ({ id }: { id: string }): Promise<void> => {
  await connectToDb()
  await Thread.deleteOne({ _id: new Types.ObjectId(id)})
},
  () => 'Failed to delete thread')

export const getThreadById = handleError(async (id: string): Promise<IThreadWithChildren | undefined> => {
  await connectToDb()
  const thread = await Thread.findById(id)
    .populate({
      path: 'author',
      model: Models.USER,
      select: '_id authId name image'
    })
    .populate({
      path: 'community',
      model: Models.COMMUNITY,
      select: '_id authOrganizationId name image'
    })
    .populate({
      path: 'likes',
      model: Models.USER,
      select: 'authId'
    })
    .populate({
      path: 'children',
      populate: [
        {
          path: "author",
          model: Models.USER,
          select: "_id authId name parentId image",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: Models.USER,
            select: "_id authId name parentId image",
          },
        },
        {
          path: "likes",
          model: Models.USER,
          select: "authId",
        },
      ],
    }).exec()

  return thread?.toObject()
},
  () => 'Failed to get thread')

interface IThreadComment {
  threadId: string
  comment: string
  userId: string
  path: string
}

export const addCommentToThread = handleError(async (params: IThreadComment): Promise<void> => {
  await connectToDb()

  const commentedThread = await Thread.findOne({ _id: params.threadId })
  if(!commentedThread) throw 'No thread to comment'

  const author = await User.findOne({ authId: params.userId })
  if(!author) throw 'No user to comment'

  const mentionedUsernames = parseMentions(params.comment)
  const taggedUsers = mentionedUsernames.length > 0
    ? (await User.find({ username: { $in: mentionedUsernames } }, { _id: 1 })).map(u => u._id)
    : []

  const commentToThread = await Thread.create({
    text: params.comment,
    author: author._id,
    parentId: commentedThread._id,
    taggedUsers,
  })

  commentedThread.children.push(commentToThread._id)
  await commentedThread.save()

  revalidatePath(params.path)

},
  () => 'Failed to add comment to thread')


interface IToggleLike {
  threadId: string
  userId: string
  path: string
}
export const toggleLike = handleError(async ({ threadId, userId, path }: IToggleLike): Promise<void> => {
  await connectToDb()

  const user = await User.findOne({ authId: userId })
  if (!user) throw 'User not found'

  const thread = await Thread.findById(threadId)
  if (!thread) throw 'Thread not found'

  const isLiked = thread.likes?.some((id: Types.ObjectId) => id.equals(user._id))

  await Thread.findByIdAndUpdate(
    threadId,
    isLiked ? { $pull: { likes: user._id } } : { $addToSet: { likes: user._id } }
  )

  revalidatePath(path)
},
  () => 'Failed to toggle like')


interface IFetchUserThreads {
  userId: string
}
export const fetchUserThreads = handleError(async ({ userId }: IFetchUserThreads): Promise<IUserWithThreadsRes | undefined> => {
  await connectToDb()
  const userWithThreads = await User.findOne({ authId: userId }).populate({
    path: 'threads',
    model: Models.THREAD,
    populate: [
      {
        path: 'community',
        model: Models.COMMUNITY,
        select: "name authOrganizationId image _id",
      },
      {
        path: 'children',
        model: Models.THREAD,
        populate: {
          path: 'author',
          model: Models.USER,
          select: 'name image authId _id'
        }
      },
      {
        path: 'likes',
        model: Models.USER,
        select: 'authId'
      }]
  })

  const user: IUserWithThreadsRes | undefined = userWithThreads?.toObject()

  return user
},
  () => 'Failed fetch user`s threads')


interface IFetchUserReplies {
  userId: string
}
export const fetchUserReplies = handleError(
  async ({ userId }: IFetchUserReplies): Promise<IUserRepliesRes> => {
    await connectToDb()

    const user = await User.findOne({ authId: userId }).select('_id')
    if (!user) throw 'User not found'

    const replyDocs = await Thread.find({
      author: user._id,
      parentId: { $ne: null },
    })
      .populate({ path: 'author', model: Models.USER, select: '_id authId name image' })
      .populate({ path: 'community', model: Models.COMMUNITY, select: '_id authOrganizationId name image' })
      .populate({
        path: 'children',
        model: Models.THREAD,
        populate: { path: 'author', model: Models.USER, select: '_id authId name image' },
      })
      .populate({ path: 'likes', model: Models.USER, select: 'authId' })
      .sort({ createdAt: 'desc' })
      .exec()

    return { replies: replyDocs.map(r => r.toObject()) }
  },
  () => 'Failed to fetch user replies'
)


interface IFetchTaggedThreads {
  userId: string
}
export const fetchTaggedThreads = handleError(
  async ({ userId }: IFetchTaggedThreads): Promise<ITaggedThreadsRes> => {
    await connectToDb()

    const user = await User.findOne({ authId: userId }).select('_id')
    if (!user) throw 'User not found'

    const threadDocs = await Thread.find({
      taggedUsers: user._id,
    })
      .populate({ path: 'author', model: Models.USER, select: '_id authId name image' })
      .populate({ path: 'community', model: Models.COMMUNITY, select: '_id authOrganizationId name image' })
      .populate({
        path: 'children',
        model: Models.THREAD,
        populate: { path: 'author', model: Models.USER, select: '_id authId name image' },
      })
      .populate({ path: 'likes', model: Models.USER, select: 'authId' })
      .sort({ createdAt: 'desc' })
      .exec()

    return { threads: threadDocs.map(t => t.toObject()) }
  },
  () => 'Failed to fetch tagged threads'
)


interface IFetchCommunityThreads {
  authOrganizationId: string
}
export const fetchCommunityThreads = handleError(async ({ authOrganizationId }: IFetchCommunityThreads): Promise<ICommunityThreadsRes | undefined> => {
    await connectToDb()
    const communityWithThreads = await Community.findOne({ authOrganizationId: authOrganizationId }).populate({
      path: 'threads',
      model: Models.THREAD,
      populate: [
        {
          path: 'author',
          model: Models.USER,
          select: 'name image authId',
        },
        {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: Models.USER,
            select: 'image authId',
          },
        },
        {
          path: 'likes',
          model: Models.USER,
          select: 'authId',
        },
      ],
    })

    const community: ICommunityThreadsRes | undefined = communityWithThreads?.toObject()

    return community
  },
  () => 'Failed fetch community`s threads')