import { Skeleton } from '@/components/ui/Skeleton'
import { ThreadCardSkeleton } from '@/components/cards/ThreadCardSkeleton'

export default function HomeLoading() {
  return (
    <section className='flex h-full flex-col'>
      <div className='flex w-full min-h-[50px] items-center bg-bg-2'>
        {[1, 2].map(i => (
          <div key={i} className='flex flex-1 min-h-[50px] items-center justify-center gap-3'>
            <Skeleton className='h-6 w-6' />
            <Skeleton className='hidden md:block h-4 w-16' />
          </div>
        ))}
      </div>

      <div className='flex flex-1 flex-col gap-9 pt-6'>
        {Array.from({ length: 3 }).map((_, i) => (
          <ThreadCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
