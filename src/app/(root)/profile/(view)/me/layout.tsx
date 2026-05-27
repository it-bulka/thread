import { ReactNode } from 'react'
import { checkExistedUser } from '@/lib/utils'
import { ProfileHeader } from '@/components/shared/ProfileHeader'
import { ProfileTabs } from '@/components/shared/ProfileTabs'
import { Pages } from '@/consts'

export default async function ProfileMeLayout({ children }: { children: ReactNode }) {
  const user = await checkExistedUser()
  if (!user) return null

  return (
    <section className='scroll-area-content'>
      <ProfileHeader
        currentUserId={user.authId}
        authUserId={user.authId}
        name={user.name}
        username={user.username}
        imgUrl={user.image}
        bio={user.bio}
      />
      <div className='mt-9'>
        <ProfileTabs basePath={Pages.MY_PROFILE} threadsCount={user.threads.length} />
        <div className='mt-9'>{children}</div>
      </div>
    </section>
  )
}
