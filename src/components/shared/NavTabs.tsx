import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { TabBadge } from '@/components/shared/TabBadge'

export interface INavTab {
  value: string
  label: string
  icon: string
  href: string
  isActive: boolean
  badge?: number
}

export const NavTabs = ({ tabs }: { tabs: INavTab[] }) => (
  <div className='flex w-full min-h-[50px] items-center bg-bg-2'>
    {tabs.map((tab) => (
      <Link
        key={tab.value}
        href={tab.href}
        className={cn(
          'flex flex-1 min-h-[50px] items-center justify-center gap-3 rounded-sm px-3 text-sm font-medium transition-all text-bg-reverse-2',
          tab.isActive ? 'bg-[#0e0e12]' : 'bg-bg-2'
        )}
      >
        <Image src={tab.icon} alt={tab.label} width={24} height={24} className='h-6 w-6 object-contain' />
        <p className='hidden md:block'>{tab.label}</p>
        {tab.badge != null && <TabBadge count={tab.badge} />}
      </Link>
    ))}
  </div>
)
