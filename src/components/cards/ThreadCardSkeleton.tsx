import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

interface ThreadCardSkeletonProps {
  isComment?: boolean
}

export const ThreadCardSkeleton = ({ isComment }: ThreadCardSkeletonProps) => (
  <article
    className={cn('flex w-full flex-col rounded-xl', {
      'px-0 xs:px-7': isComment,
      'bg-bg-2 p-7': !isComment,
    })}
  >
    <div className='flex w-full flex-1 flex-row gap-4'>
      <div className='flex flex-col items-center gap-2'>
        <Skeleton className='h-11 w-11 rounded-full' />
        <Skeleton className='h-16 w-0.5 rounded-none' />
      </div>

      <div className='flex w-full flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-3 w-16' />
        </div>

        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />
        <Skeleton className='h-4 w-3/5' />

        <div className='mt-2 flex gap-3.5'>
          <Skeleton className='h-6 w-6' />
          <Skeleton className='h-6 w-6' />
          <Skeleton className='h-6 w-6' />
          <Skeleton className='h-6 w-6' />
        </div>
      </div>
    </div>
  </article>
)
