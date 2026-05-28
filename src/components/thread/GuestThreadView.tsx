import Link from 'next/link'
import { ThreadCard } from '@/components/cards/ThreadCard'
import { ThreadList } from '@/components/shared/ThreadList'
import { Pages } from '@/consts'
import { IThreadWithChildren } from '@/types'

interface IGuestThreadViewProps {
  thread: IThreadWithChildren
}

export const GuestThreadView = ({ thread }: IGuestThreadViewProps) => {
  return (
    <section className='relative'>
      <ThreadCard
        id={thread._id}
        currentUserId={null}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
        likes={thread.likes?.map(l => l.authId) ?? []}
      />

      <div className='mt-7'>
        <p className='text-base-regular text-bg-secondary-1'>
          <Link href={Pages.SIGN_IN} className='text-primary-500 underline'>Sign in</Link> to leave a comment
        </p>
      </div>

      <div className='mt-10'>
        <ThreadList
          currentUserId={null}
          threads={thread.children.map((child: any) => ({
            id: child._id,
            parentId: child.parentId,
            content: child.text,
            author: child.author,
            community: child.community,
            createdAt: child.createdAt,
            comments: child.children ?? [],
            likes: child.likes?.map((l: any) => l.authId) ?? [],
            isComment: true,
          }))}
        />
      </div>
    </section>
  )
}
