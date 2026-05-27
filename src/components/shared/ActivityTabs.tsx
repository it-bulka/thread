'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { activityTabs, Pages } from '@/consts'
import { cn } from '@/lib/utils'

const tabRoutes: Record<string, string> = {
  'liked-me': Pages.ACTIVITY,
  'my-likes': `${Pages.ACTIVITY}/my-likes`,
}

export const ActivityTabs = () => {
  const pathname = usePathname()
  const activeIndex = activityTabs.findIndex(tab => tabRoutes[tab.value] === pathname)
  const tabWidth = 100 / activityTabs.length

  return (
    <div className='relative flex w-full border-b border-bg-4'>
      {activityTabs.map((tab) => {
        const href = tabRoutes[tab.value]
        const isActive = pathname === href
        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              'flex flex-1 items-center justify-center gap-3 px-4 py-3 text-small-semibold transition-colors',
              isActive
                ? 'text-bg-reverse-1'
                : 'text-bg-secondary-1 hover:text-bg-reverse-2'
            )}
          >
            <Image
              src={tab.icon}
              alt={tab.label}
              width={20}
              height={20}
              className={cn('object-contain transition-opacity', !isActive && 'opacity-50')}
            />
            <p className='hidden md:block'>{tab.label}</p>
          </Link>
        )
      })}

      <div
        className='absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-300 ease-in-out'
        style={{ left: `${activeIndex * tabWidth}%`, width: `${tabWidth}%` }}
      />
    </div>
  )
}
