import { Skeleton } from '@/components/ui/Skeleton'

export const UserCardSkeleton = () => (
  <article className='user-card'>
    <div className='user-card_avatar'>
      <Skeleton className='h-12 w-12 shrink-0 rounded-full' />
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-3 w-20' />
      </div>
    </div>
    <Skeleton className='h-9 w-20 rounded-lg' />
  </article>
)
