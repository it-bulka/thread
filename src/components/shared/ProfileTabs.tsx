'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { profileTabs } from '@/consts'
import { cn } from '@/lib/utils'

interface IProfileTabsProps {
  basePath: string
  threadsCount: number
}

export const ProfileTabs = ({ basePath, threadsCount }: IProfileTabsProps) => {
  const pathname = usePathname()

  const tabRoutes: Record<string, string> = {
    threads: basePath,
    replies: `${basePath}/replies`,
    tagged: `${basePath}/tagged`,
  }

  return (
    <div className='flex w-full min-h-[50px] items-center bg-bg-2'>
      {profileTabs.map((tab) => {
        const href = tabRoutes[tab.value]
        const isActive = pathname === href
        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              'flex flex-1 min-h-[50px] items-center justify-center gap-3 rounded-sm px-3 text-sm font-medium transition-all text-bg-reverse-2',
              isActive ? 'bg-[#0e0e12]' : 'bg-bg-2'
            )}
          >
            <Image
              src={tab.icon}
              alt={tab.label}
              width={24}
              height={24}
              className='object-contain'
            />
            <p className='hidden md:block'>{tab.label}</p>
            {tab.value === 'threads' && (
              <p className='ml-1 rounded-sm bg-bg-reverse-4 px-2 py-1 !text-tiny-medium text-bg-reverse-2'>
                {threadsCount}
              </p>
            )}
          </Link>
        )
      })}
    </div>
  )
}
