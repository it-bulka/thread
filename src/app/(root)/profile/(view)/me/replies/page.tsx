import { checkExistedUser } from '@/lib/utils'
import { fetchUserReplies } from '@/services'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { ThreadList } from '@/components/shared/ThreadList'

export default async function ProfileMeReplies() {
  const user = await checkExistedUser()
  if (!user) return null

  const result = await fetchUserReplies({ userId: user.authId })
  if (!result.ok) return <ErrorMessage message={result.error} />

  const { replies } = result.data

  if (!replies.length) {
    return <p className='text-center text-base-regular text-bg-secondary-1'>No replies yet</p>
  }

  return (
    <section className='flex flex-col gap-10'>
      <ThreadList
        currentUserId={user.authId}
        threads={replies.map(thread => ({
          id: thread._id,
          parentId: thread.parentId,
          content: thread.text,
          isComment: true,
          author: { name: thread.author.name, image: thread.author.image, authId: thread.author.authId, username: thread.author.username },
          community: thread.community,
          createdAt: thread.createdAt,
          comments: thread.children,
          likes: thread.likes?.map(l => l.authId) ?? [],
        }))}
      />
    </section>
  )
}
