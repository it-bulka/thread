import { Skeleton } from '@/components/ui/Skeleton'

export const ProfileHeaderSkeleton = () => (
  <div className='flex w-full flex-col justify-start'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-20 w-20 shrink-0 rounded-full' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-6 w-40' />
          <Skeleton className='h-4 w-28' />
        </div>
      </div>
      <Skeleton className='h-9 w-20 rounded-lg' />
    </div>

    <Skeleton className='mt-6 h-4 w-full max-w-lg' />
    <Skeleton className='mt-2 h-4 w-3/4 max-w-lg' />

    <div className='mt-12 h-0.5 w-full bg-bg-3' />
  </div>
)
