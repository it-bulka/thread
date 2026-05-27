import { Skeleton } from '@/components/ui/Skeleton'
import { ThreadCardSkeleton } from '@/components/cards/ThreadCardSkeleton'

export default function ThreadLoading() {
  return (
    <section className='relative'>
      <ThreadCardSkeleton />

      <div className='comment-form mt-7'>
        <div className='flex w-full items-center gap-3'>
          <Skeleton className='h-12 w-12 shrink-0 rounded-full' />
          <Skeleton className='h-5 flex-1' />
        </div>
        <Skeleton className='h-9 w-16 rounded-full' />
      </div>

      <div className='mt-10 flex flex-col gap-10'>
        {Array.from({ length: 3 }).map((_, i) => (
          <ThreadCardSkeleton key={i} isComment />
        ))}
      </div>
    </section>
  )
}
