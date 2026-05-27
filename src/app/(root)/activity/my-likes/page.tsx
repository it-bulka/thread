import { checkExistedUser } from '@/lib/utils'
import { getLikedThreads } from '@/services/user'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { Pagination } from '@/components/shared/Pagination'
import { Pages } from '@/consts'
import { ThreadCard } from '@/components/cards/ThreadCard'

export default async function MyLikes({ searchParams }: { searchParams: { page?: string } }) {
  const user = await checkExistedUser()
  if (!user) return null

  const pageNumber = Number(searchParams?.page) || 1

  const result = await getLikedThreads(user.authId, pageNumber)
  if (!result.ok) return <ErrorMessage message={result.error} />

  const { threads: likedThreads, totalPages, page } = result.data

  if (!likedThreads.length) {
    return <p className='text-center text-base-regular text-bg-secondary-1'>No liked threads yet</p>
  }

  return (
    <div className='flex flex-col gap-9'>
      {likedThreads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user.authId}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community ?? undefined}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes?.map(l => l.authId) ?? []}
        />
      ))}

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} activePage={page} path={`${Pages.ACTIVITY}/my-likes`} />
      )}
    </div>
  )
}
