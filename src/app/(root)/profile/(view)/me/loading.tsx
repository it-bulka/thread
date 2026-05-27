import { ThreadCardSkeleton } from '@/components/cards/ThreadCardSkeleton'

export default function ProfileMeLoading() {
  return (
    <div className='flex flex-col gap-10'>
      {Array.from({ length: 3 }).map((_, i) => (
        <ThreadCardSkeleton key={i} />
      ))}
    </div>
  )
}
