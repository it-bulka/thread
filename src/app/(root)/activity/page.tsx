import { checkExistedUser } from '@/lib/utils'
import { getActivities } from '@/services/user'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { Pagination } from '@/components/shared/Pagination'
import { Pages } from '@/consts'
import Image from 'next/image'
import Link from 'next/link'

export default async function Activity({ searchParams }: { searchParams: { page?: string } }) {
  const user = await checkExistedUser()
  if (!user) return null

  const pageNumber = Number(searchParams?.page) || 1

  const result = await getActivities(user.authId, pageNumber)
  if (!result.ok) return <ErrorMessage message={result.error} />

  const { activities, totalPages, page } = result.data

  if (!activities.length) {
    return <p className='text-center text-base-regular text-bg-secondary-1'>No activity yet</p>
  }

  return (
    <div className='flex flex-col gap-5'>
      {activities.map((item, i) => (
        <Link
          key={i}
          href={`${Pages.THREAD}/${item.threadId}`}
          className='flex items-center gap-4 rounded-xl bg-bg-2 p-4'
        >
          <div className='relative h-10 w-10 shrink-0'>
            <Image
              src={item.user.image}
              alt={item.user.name}
              fill
              sizes='40px'
              className='rounded-full object-cover'
            />
          </div>
          <p className='text-small-regular text-bg-reverse-2'>
            <span className='text-base-semibold text-bg-reverse-1'>{item.user.name} </span>
            {item.type === 'like' ? 'liked your thread' : 'replied to your thread'}
          </p>
        </Link>
      ))}

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} activePage={page} path={Pages.ACTIVITY} />
      )}
    </div>
  )
}
