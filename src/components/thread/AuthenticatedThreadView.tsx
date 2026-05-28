import { ThreadCard } from '@/components/cards/ThreadCard'
import { ThreadList } from '@/components/shared/ThreadList'
import { CommentForm } from '@/components/forms/CommentForm'
import { IThreadWithChildren, IUserRes } from '@/types'

interface IAuthenticatedThreadViewProps {
  thread: IThreadWithChildren
  threadId: string
  user: Pick<IUserRes, 'authId' | 'image'>
  communityAuthId?: string
  communityName?: string
  isPrivateCommunity: boolean
  isMember: boolean
  hasPendingRequest: boolean
}

export const AuthenticatedThreadView = ({
  thread,
  threadId,
  user,
  communityAuthId,
  communityName,
  isPrivateCommunity,
  isMember,
  hasPendingRequest,
}: IAuthenticatedThreadViewProps) => {
  return (
    <section className='relative'>
      <ThreadCard
        id={thread._id}
        currentUserId={user.authId}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
        likes={thread.likes?.map(l => l.authId) ?? []}
      />

      <div className='mt-7'>
        <CommentForm
          threadId={threadId}
          currentUserImg={user.image}
          currentUserId={user.authId}
          communityAuthId={communityAuthId}
          communityName={communityName}
          isPrivateCommunity={isPrivateCommunity}
          isMember={isMember}
          hasPendingRequest={hasPendingRequest}
        />
      </div>

      <div className='mt-10'>
        <ThreadList
          currentUserId={user.authId}
          threads={thread.children.map((child: any) => ({
            id: child._id,
            parentId: child.parentId,
            content: child.text,
            author: child.author,
            community: child.community,
            createdAt: child.createdAt,
            comments: child.children ?? [],
            likes: child.likes?.map((l: any) => l.authId) ?? [],
            isComment: true,
          }))}
        />
      </div>
    </section>
  )
}
