'use client'
import { useOptimistic } from 'react'
import { ThreadCard } from '@/components/cards/ThreadCard'

export type ThreadListItem = {
  id: string
  parentId?: string
  content: string
  author: { name: string; image: string; authId: string; username: string }
  community?: { authOrganizationId: string; name: string; image: string } | null
  createdAt: string
  comments: { author: { image: string } }[]
  isComment?: boolean
  likes?: string[]
}

interface IThreadListProps {
  threads: ThreadListItem[]
  currentUserId: string | null
}

export const ThreadList = ({ threads, currentUserId }: IThreadListProps) => {
  const [optimisticThreads, removeThread] = useOptimistic(
    threads,
    (state, deletedId: string) => state.filter(t => t.id !== deletedId)
  )

  return (
    <>
      {optimisticThreads.map(thread => (
        <ThreadCard
          key={thread.id}
          {...thread}
          community={thread.community ?? undefined}
          currentUserId={currentUserId}
          onDelete={removeThread}
        />
      ))}
    </>
  )
}
