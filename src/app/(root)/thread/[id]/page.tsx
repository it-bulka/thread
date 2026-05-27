import { ThreadCard } from '@/components/cards/ThreadCard';
import { checkExistedUser } from '@/lib/utils';
import { getThreadById } from '@/services/thread';
import { fetchCommunityDetails } from '@/services';
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

  let communityAuthId: string | undefined
  let communityName: string | undefined
  let isPrivateCommunity = false
  let isMember = false
  let hasPendingRequest = false

  if (thread.community?.isPrivate) {
    communityAuthId = thread.community.authOrganizationId
    communityName = thread.community.name
    isPrivateCommunity = true

    const communityResult = await fetchCommunityDetails({ authOrganizationId: communityAuthId })
    if (communityResult.ok) {
      isMember = communityResult.data.members.some(m => m.authId === user.authId)
      hasPendingRequest = communityResult.data.joinRequests.some(r => r.authId === user.authId)
    }
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
          communityAuthId={communityAuthId}
          communityName={communityName}
          isPrivateCommunity={isPrivateCommunity}
          isMember={isMember}
          hasPendingRequest={hasPendingRequest}
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
