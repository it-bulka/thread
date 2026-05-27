import { ReactNode } from 'react'
import { ActivityTabs } from '@/components/shared/ActivityTabs'

export default function ActivityLayout({ children }: { children: ReactNode }) {
  return (
    <section className='mt-9'>
      <ActivityTabs />
      <div className='mt-9 w-full'>{children}</div>
    </section>
  )
}
