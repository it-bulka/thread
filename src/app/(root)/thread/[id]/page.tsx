import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs'
import { fetchUser, fetchCommunityDetails } from '@/services'
import { getThreadById } from '@/services/thread'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { AuthenticatedThreadView } from '@/components/thread/AuthenticatedThreadView'
import { GuestThreadView } from '@/components/thread/GuestThreadView'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000/').replace(/\/$/, '')

const truncate = (text: string, length: number) =>
  text.length > length ? text.slice(0, length) + '…' : text

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const result = await getThreadById(params.id)
  if (!result.ok || !result.data) return { title: 'Thread not found' }

  const { author, text = '' } = result.data
  const title = `@${author.username}: ${truncate(text, 100)}`
  const description = truncate(text, 200)
  const url = `${APP_URL}/thread/${params.id}`

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      ...(author.image && {
        images: [{ url: author.image, width: 400, height: 400, alt: `${author.name}'s avatar` }],
      }),
    },
    twitter: {
      card: 'summary',
      title,
      description,
      ...(author.image && { images: [author.image] }),
    },
  }
}

export default async function Thread({ params }: { params: { id: string } }) {
  const { userId } = auth()

  const [threadResult, userResult] = await Promise.all([
    getThreadById(params.id),
    userId ? fetchUser(userId) : Promise.resolve(null),
  ])

  if (!threadResult.ok) return <ErrorMessage message={threadResult.error} />
  const thread = threadResult.data
  if (!thread) return <>Thread not found</>

  const user = userResult?.ok ? userResult.data : null
  if (!user) return <GuestThreadView thread={thread} />

  const privateCommunity = thread.community?.isPrivate ? thread.community : null
  let isMember = false
  let hasPendingRequest = false

  if (privateCommunity) {
    const communityResult = await fetchCommunityDetails({ authOrganizationId: privateCommunity.authOrganizationId })
    if (communityResult.ok) {
      isMember = communityResult.data.members.some(m => m.authId === user.authId)
      hasPendingRequest = communityResult.data.joinRequests.some((r: any) => r.authId === user.authId)
    }
  }

  return (
    <AuthenticatedThreadView
      thread={thread}
      threadId={params.id}
      user={user}
      communityAuthId={privateCommunity?.authOrganizationId}
      communityName={privateCommunity?.name}
      isPrivateCommunity={!!privateCommunity}
      isMember={isMember}
      hasPendingRequest={hasPendingRequest}
    />
  )
}
