import { ThreadCard } from '@/components/cards/ThreadCard';
import { checkExistedUser } from '@/lib/utils';
import { getThreadById } from '@/services/thread';
import { CommentForm } from '@/components/forms/CommentForm';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

export default async function Thread ( { params } : {params:  { id: string } }) {
  const user = await checkExistedUser()
  const threadResult = await getThreadById(params.id)

  if (!threadResult.ok) return <ErrorMessage message={threadResult.error} />
  const thread = threadResult.data

  if(!user || !thread) {
    return <>Thread not found</>
  }

  return (
    <section className='relative'>
      <ThreadCard
        id={thread._id}
        currentUserId={user?.authId}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
        likes={thread.likes?.map((l: any) => l.authId) ?? []}
      />

      <div className='mt-7'>
        <CommentForm
          threadId={params.id}
          currentUserImg={user.image}
          currentUserId={user.authId}
        />
      </div>

      <div className='mt-10'>
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.authId}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            likes={childItem.likes?.map((l: any) => l.authId) ?? []}
            isComment
          />
        ))}
      </div>
    </section>
  )
}