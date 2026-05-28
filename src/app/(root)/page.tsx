import { Pagination } from '@/components/shared/Pagination';
import { HomeTabs } from '@/components/shared/HomeTabs';
import { ThreadList } from '@/components/shared/ThreadList';
import { fetchFeedThreads } from '@/services/thread';
import { checkExistedUser } from '@/lib/utils';
import { Pages } from '@/consts';

const PAGE_SIZE = 10

type FeedTab = 'all' | 'following'

interface HomeProps {
  searchParams: { page?: string; tab?: string }
}

export default async function Home({ searchParams }: HomeProps) {
  const user = await checkExistedUser()
  if (!user) return null

  const tab: FeedTab = searchParams.tab === 'following' ? 'following' : 'all'
  const page = Math.max(1, Number(searchParams.page) || 1)

  const result = await fetchFeedThreads({
    page,
    pageSize: PAGE_SIZE,
    ...(tab === 'following' && { userAuthId: user.authId }),
  })

  const threads = result.ok ? result.data.threads : []
  const totalPages = result.ok ? result.data.totalPages : 0

  return (
    <section className='flex h-full flex-col'>
      <HomeTabs />

      <div className='custom-scrollbar flex flex-1 flex-col gap-9 overflow-y-auto pt-6'>
        {threads.length === 0 ? (
          <p className='py-10 text-center text-base-regular text-bg-secondary-1'>
            {tab === 'following'
              ? 'Join communities to see their threads here.'
              : 'No threads yet.'}
          </p>
        ) : (
          <>
            <ThreadList
              currentUserId={user.authId}
              threads={threads.map(thread => ({
                id: thread._id,
                parentId: thread.parentId,
                content: thread.text,
                author: thread.author,
                community: thread.community,
                createdAt: thread.createdAt,
                comments: thread.children,
                likes: thread.likes?.map(l => l.authId),
              }))}
            />

            {totalPages > 1 && (
              <Pagination totalPages={totalPages} activePage={page} path={Pages.HOME} />
            )}
          </>
        )}
      </div>
    </section>
  )
}
