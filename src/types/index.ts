export interface IUserRes {
  _id: string
  authId: string
  username: string
  name: string
  image: string
  bio: string
  threads: string[]
  onboarded: Boolean
  communities: string[]
}


export interface IThreadRes {
  _id: string
  text: string
  author: string
  community: string | null
  path: string
  parentId?: string
  children?: string[]
  likes?: string[]
  taggedUsers?: string[]
  createdAt: string
  updatedAt: string
}

export interface IActivityItem {
  type: 'like' | 'reply'
  user: { name: string; image: string; authId: string }
  threadId: string
  createdAt: string
}

export interface ILikedThread extends Omit<IPopulatedThread, 'community'> {
  community: {
    _id: string
    authOrganizationId: string
    name: string
    image: string
  } | null
}

export interface ICommunityRes {
  _id: string
  authOrganizationId: string
  username: string
  name: string
  image: string
  bio: string
  createdBy: string
  threads: string[]
  members: IUserRes[]
  isPrivate: boolean
  joinRequests: string[]
}

type Author = Pick<IUserRes, '_id' | 'authId' | 'image' | 'name'>

type Community = {
  _id: string
  authOrganizationId: string
  name: string
  image: string
  isPrivate: boolean
}

export interface ICommunityAccessStatus {
  isPrivate: boolean
  isMember: boolean
  hasPendingRequest: boolean
}
export interface IThreadWithChildren extends Omit<IThreadRes, 'author' | 'community' | 'children' | 'likes'> {
  author: Author
  community: Community
  likes?: Pick<IUserRes, 'authId'>[]
  children: {
    author: Author & { parentId: string },
    community: Community
    likes?: Pick<IUserRes, 'authId'>[]
  }[]
}

export interface IPopulatedThread extends Omit<IThreadRes, 'author' | 'community' | 'children' | 'likes'> {
  author: Author
  community: Community
  likes?: Pick<IUserRes, 'authId'>[]
  children: {
    author: Author,
  }[]
}
export interface IUserWithThreadsRes extends Omit<IUserRes, 'threads' | 'community'>{
  threads: IPopulatedThread[]
  community: Pick<ICommunityRes, 'name' | 'authOrganizationId' | 'image' | '_id'>[]
}

export interface IUserRepliesRes {
  replies: IPopulatedThread[]
}

export interface ITaggedThreadsRes {
  threads: IPopulatedThread[]
}

interface IPopulatedThreadForCommunity extends Omit<IThreadRes, 'author' | 'community' | 'children' | 'likes'>  {
  author: Omit<Author, '_id'>
  likes?: Pick<IUserRes, 'authId'>[]
  children: {
    author: Omit<Author, '_id'>,
  }[]
}

export interface ICommunityThreadsRes extends Omit<ICommunityRes, 'threads'>{
  threads: IPopulatedThreadForCommunity[]
}


export interface ICommunityDetailsRes extends Omit<ICommunityRes, 'createdBy' | 'members' | 'joinRequests'>{
  createdBy: IUserRes
  members: Pick<IUserRes, '_id' | 'authId' | 'name' | 'username' | 'image'>[]
  joinRequests: Pick<IUserRes, '_id' | 'authId' | 'name' | 'username' | 'image'>[]
}

