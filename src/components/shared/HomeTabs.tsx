'use client'
import { useSearchParams } from 'next/navigation'
import { NavTabs, INavTab } from '@/components/shared/NavTabs'

const HOME_TABS: Omit<INavTab, 'isActive'>[] = [
  { value: 'all',       label: 'For You',   icon: '/assets/home.svg',    href: '/' },
  { value: 'following', label: 'Following', icon: '/assets/members.svg', href: '/?tab=following' },
]

export const HomeTabs = () => {
  const searchParams = useSearchParams()
  const active = searchParams.get('tab') === 'following' ? 'following' : 'all'

  const tabs: INavTab[] = HOME_TABS.map((tab) => ({ ...tab, isActive: tab.value === active }))
  return <NavTabs tabs={tabs} />
}
