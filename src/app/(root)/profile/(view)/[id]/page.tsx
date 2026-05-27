import { checkExistedUser } from '@/lib/utils'
import { ThreadTab } from '@/components/shared/ThreadTab'

export default async function ProfileIdThreads({ params }: { params: { id: string } }) {
  const user = await checkExistedUser()
  if (!user) return null

  return (
    <ThreadTab
      ownerId={params.id}
      accountType='user'
      currentUserId={user.authId}
    />
  )
}
