import { Skeleton } from '@/components/ui/Skeleton'

export const ActivityItemSkeleton = () => (
  <div className='flex items-center gap-4 rounded-xl bg-bg-2 p-4'>
    <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
    <div className='flex gap-2'>
      <Skeleton className='h-4 w-24' />
      <Skeleton className='h-4 w-36' />
    </div>
  </div>
)
