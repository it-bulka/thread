import { checkExistedUser } from '@/lib/utils'
import { fetchTaggedThreads } from '@/services'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { ThreadList } from '@/components/shared/ThreadList'

export default async function ProfileIdTagged({ params }: { params: { id: string } }) {
  const user = await checkExistedUser()
  if (!user) return null

  const result = await fetchTaggedThreads({ userId: params.id })
  if (!result.ok) return <ErrorMessage message={result.error} />

  const { threads } = result.data

  if (!threads.length) {
    return <p className='text-center text-base-regular text-bg-secondary-1'>No tagged threads yet</p>
  }

  return (
    <section className='flex flex-col gap-10'>
      <ThreadList
        currentUserId={user.authId}
        threads={threads.map(thread => ({
          id: thread._id,
          parentId: thread.parentId,
          content: thread.text,
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
