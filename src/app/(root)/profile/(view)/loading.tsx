import { ProfileHeaderSkeleton } from '@/components/shared/ProfileHeaderSkeleton'
import { Skeleton } from '@/components/ui/Skeleton'
import { ThreadCardSkeleton } from '@/components/cards/ThreadCardSkeleton'

export default function ProfileViewLoading() {
  return (
    <section>
      <ProfileHeaderSkeleton />

      <div className='mt-9'>
        <div className='flex w-full min-h-[50px] items-center bg-bg-2'>
          {[1, 2, 3].map(i => (
            <div key={i} className='flex flex-1 min-h-[50px] items-center justify-center gap-3'>
              <Skeleton className='h-6 w-6' />
              <Skeleton className='hidden md:block h-4 w-14' />
            </div>
          ))}
        </div>

        <div className='mt-9 flex flex-col gap-10'>
          {Array.from({ length: 3 }).map((_, i) => (
            <ThreadCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
