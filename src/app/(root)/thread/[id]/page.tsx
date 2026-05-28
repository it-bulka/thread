import type { Metadata } from 'next';
import { ThreadCard } from '@/components/cards/ThreadCard';
import { ThreadList } from '@/components/shared/ThreadList';
import { checkExistedUser } from '@/lib/utils';
import { getThreadById } from '@/services/thread';
import { fetchCommunityDetails } from '@/services';
import { CommentForm } from '@/components/forms/CommentForm';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000/').replace(/\/$/, '')

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const result = await getThreadById(params.id)

  if (!result.ok || !result.data) {
    return { title: 'Thread not found' }
  }

  const thread = result.data
  const author = thread.author as any

  const text = thread.text ?? ''
  const shortText = text.length > 100 ? text.slice(0, 100) + '…' : text
  const description = text.length > 200 ? text.slice(0, 200) + '…' : text
  const title = `@${author.username}: ${shortText}`
  const url = `${APP_URL}/thread/${params.id}`
  const image: string | undefined = author.image

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      ...(image && {
        images: [{ url: image, width: 400, height: 400, alt: `${author.name}'s avatar` }],
      }),
    },
    twitter: {
      card: 'summary',
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}

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
        <ThreadList
          currentUserId={user.authId}
          threads={thread.children.map((childItem: any) => ({
            id: childItem._id,
            parentId: childItem.parentId,
            content: childItem.text,
            author: childItem.author,
            community: childItem.community,
            createdAt: childItem.createdAt,
            comments: childItem.children ?? [],
            likes: childItem.likes?.map((l: any) => l.authId) ?? [],
            isComment: true,
          }))}
        />
      </div>
    </section>
  )
}
