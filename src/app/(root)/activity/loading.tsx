import { ActivityItemSkeleton } from '@/components/shared/ActivityItemSkeleton'

export default function ActivityLoading() {
  return (
    <div className='flex flex-col gap-5'>
      {Array.from({ length: 3 }).map((_, i) => (
        <ActivityItemSkeleton key={i} />
      ))}
    </div>
  )
}
