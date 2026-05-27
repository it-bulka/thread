'use client'
import { usePathname } from 'next/navigation'
import { profileTabs } from '@/consts'
import { NavTabs, INavTab } from '@/components/shared/NavTabs'

interface IProfileTabsProps {
  basePath: string
  threadsCount: number
}

export const ProfileTabs = ({ basePath, threadsCount }: IProfileTabsProps) => {
  const pathname = usePathname()

  const tabRoutes: Record<string, string> = {
    threads: basePath,
    replies: `${basePath}/replies`,
    tagged:  `${basePath}/tagged`,
  }

  const tabs: INavTab[] = profileTabs.map((tab) => ({
    ...tab,
    href: tabRoutes[tab.value],
    isActive: pathname === tabRoutes[tab.value],
    badge: tab.value === 'threads' ? threadsCount : undefined,
  }))

  return <NavTabs tabs={tabs} />
}
