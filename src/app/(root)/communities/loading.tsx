import { Skeleton } from '@/components/ui/Skeleton'
import { CommunityCardSkeleton } from '@/components/cards/CommunityCardSkeleton'

export default function CommunitiesLoading() {
  return (
    <>
      <Skeleton className='h-9 w-48' />

      <div className='mt-5'>
        <div className='searchbar'>
          <Skeleton className='h-5 w-5 shrink-0' />
          <Skeleton className='h-4 flex-1' />
        </div>
      </div>

      <section className='mt-9 flex flex-wrap gap-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <CommunityCardSkeleton key={i} />
        ))}
      </section>
    </>
  )
}
