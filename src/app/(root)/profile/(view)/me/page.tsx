import { checkExistedUser } from '@/lib/utils'
import { ThreadTab } from '@/components/shared/ThreadTab'

export default async function ProfileMeThreads() {
  const user = await checkExistedUser()
  if (!user) return null

  return (
    <ThreadTab
      ownerId={user.authId}
      accountType='user'
      currentUserId={user.authId}
    />
  )
}
