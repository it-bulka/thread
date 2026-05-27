import { ReactNode } from 'react'
import { checkExistedUser } from '@/lib/utils'
import { fetchUser } from '@/services'
import { ProfileHeader } from '@/components/shared/ProfileHeader'
import { ProfileTabs } from '@/components/shared/ProfileTabs'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { Pages } from '@/consts'
import { redirect } from 'next/navigation'

export default async function ProfileIdLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { id: string }
}) {
  const currentUser = await checkExistedUser()
  if (!currentUser) return null

  const result = await fetchUser(params.id)
  if (!result.ok) return <ErrorMessage message={result.error} />

  const profileUser = result.data
  if (!profileUser) redirect(Pages.MY_PROFILE)

  const basePath = `${Pages.PROFILE}/${params.id}`

  return (
    <section className='scroll-area-content'>
      <ProfileHeader
        currentUserId={currentUser.authId}
        authUserId={profileUser.authId}
        name={profileUser.name}
        username={profileUser.username}
        imgUrl={profileUser.image}
        bio={profileUser.bio}
      />
      <div className='mt-9'>
        <ProfileTabs basePath={basePath} threadsCount={profileUser.threads.length} />
        <div className='mt-9'>{children}</div>
      </div>
    </section>
  )
}
