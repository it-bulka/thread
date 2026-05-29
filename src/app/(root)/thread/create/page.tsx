import { checkExistedUser } from '@/lib/utils';
import { ThreadForm } from '@/components/forms/ThreadForm';
import { fetchUserMemberCommunities } from '@/services';

export default async function CreateThread () {
  const user = await checkExistedUser()
  if(!user) return null

  const communitiesResult = await fetchUserMemberCommunities(user.authId)
  const communities = communitiesResult.ok ? communitiesResult.data : []

  return (
    <>
      <h1 className='head-text'>Create Thread</h1>
      <ThreadForm authorId={user.authId} communities={communities} />
    </>
  )
}