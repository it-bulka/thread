import { Skeleton } from '@/components/ui/Skeleton'

export const CommunityCardSkeleton = () => (
  <article className='community-card'>
    <div className='flex flex-wrap items-center gap-3'>
      <Skeleton className='h-12 w-12 shrink-0 rounded-full' />
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-3 w-20' />
      </div>
    </div>

    <Skeleton className='mt-4 h-3 w-full' />
    <Skeleton className='mt-2 h-3 w-4/5' />

    <div className='mt-5 flex items-center justify-between'>
      <Skeleton className='h-9 w-20 rounded-lg' />
      <div className='flex items-center'>
        <Skeleton className='h-7 w-7 rounded-full' />
        <Skeleton className='-ml-2 h-7 w-7 rounded-full' />
        <Skeleton className='-ml-2 h-7 w-7 rounded-full' />
      </div>
    </div>
  </article>
)
