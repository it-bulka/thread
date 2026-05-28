import { checkExistedUser } from '@/lib/utils'
import { fetchUserReplies } from '@/services'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { ThreadCard } from '@/components/cards/ThreadCard'

export default async function ProfileIdReplies({ params }: { params: { id: string } }) {
  const user = await checkExistedUser()
  if (!user) return null

  const result = await fetchUserReplies({ userId: params.id })
  if (!result.ok) return <ErrorMessage message={result.error} />

  const { replies } = result.data

  if (!replies.length) {
    return <p className='text-center text-base-regular text-bg-secondary-1'>No replies yet</p>
  }

  return (
    <section className='flex flex-col gap-10'>
      {replies.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user.authId}
          parentId={thread.parentId}
          content={thread.text}
          isComment={true}
          author={{
            name: thread.author.name,
            image: thread.author.image,
            authId: thread.author.authId,
            username: thread.author.username,
          }}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes?.map(l => l.authId) ?? []}
        />
      ))}
    </section>
  )
}
