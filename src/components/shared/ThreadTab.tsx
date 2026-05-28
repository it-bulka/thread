import { ThreadList } from '@/components/shared/ThreadList';
import { IUserWithThreadsRes, ICommunityThreadsRes, IPopulatedThread } from '@/types';
import { fetchCommunityThreads, fetchUserThreads } from '@/services';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

interface IThreadTabProps {
  ownerId: string
  accountType: 'community' | 'user'
  currentUserId: string
}
export const ThreadTab = async ({ ownerId, accountType, currentUserId }: IThreadTabProps) => {
  let result: IUserWithThreadsRes | ICommunityThreadsRes | undefined

  if (accountType === 'community') {
    const fetchResult = await fetchCommunityThreads({ authOrganizationId: ownerId })
    if (!fetchResult.ok) return <ErrorMessage message={fetchResult.error} />
    result = fetchResult.data
  } else {
    const fetchResult = await fetchUserThreads({ userId: ownerId })
    if (!fetchResult.ok) return <ErrorMessage message={fetchResult.error} />
    result = fetchResult.data
  }

  if (!result) return null

  const threads = result.threads.map((thread) => ({
    id: thread._id,
    parentId: thread.parentId,
    content: thread.text,
    author: accountType === 'user'
      ? { name: result!.name, image: result!.image, authId: (result as IUserWithThreadsRes).authId, username: (result as IUserWithThreadsRes).username }
      : { name: thread.author.name, image: thread.author.image, authId: thread.author.authId, username: thread.author.username },
    community: accountType === 'community'
      ? { name: result!.name, authOrganizationId: (result as ICommunityThreadsRes).authOrganizationId, image: result!.image }
      : (thread as IPopulatedThread).community,
    createdAt: thread.createdAt,
    comments: thread.children,
    likes: thread.likes?.map(l => l.authId) ?? [],
  }))

  return (
    <section className='mt-9 flex flex-col gap-10'>
      <ThreadList threads={threads} currentUserId={currentUserId} />
    </section>
  )
}
