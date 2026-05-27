import { Skeleton } from '@/components/ui/Skeleton'
import { UserCardSkeleton } from '@/components/cards/UserCardSkeleton'

export default function SearchLoading() {
  return (
    <section>
      <Skeleton className='mb-10 h-9 w-32' />

      <div className='searchbar'>
        <Skeleton className='h-5 w-5 shrink-0' />
        <Skeleton className='h-4 flex-1' />
      </div>

      <div className='mt-14 flex flex-col gap-9'>
        {Array.from({ length: 3 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
