import { auth } from '@clerk/nextjs'
import { fetchSuggestedCommunities, fetchSuggestedUsers } from '@/services'
import { CommunityCard } from '@/components/cards/CommunityCard'
import { UserCard } from '@/components/cards/UserCard'
import { ISuggestedCommunity, ISuggestedUser } from '@/types'

export const RightSidebar = async () => {
  const { userId } = auth()

  const [commResult, usersResult] = await Promise.all([
    userId ? fetchSuggestedCommunities(userId) : null,
    userId ? fetchSuggestedUsers(userId) : null,
  ])

  const suggested: ISuggestedCommunity[] = commResult?.ok ? commResult.data : []
  const suggestedUsers: ISuggestedUser[] = usersResult?.ok ? usersResult.data : []

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-bg-reverse-1'>
          Suggested Communities
        </h3>

        <div className='mt-7 flex w-[350px] flex-col gap-9'>
          {suggested.length === 0 ? (
            <p className='text-small-regular text-bg-secondary-1'>
              No recommendations for you yet.
            </p>
          ) : (
            suggested.map((community) => (
              <CommunityCard
                key={community.authOrganizationId}
                authOrganizationId={community.authOrganizationId}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-bg-reverse-1'>Suggested Users</h3>
        <div className='mt-7 flex w-[350px] flex-col gap-10'>
          {suggestedUsers.length === 0 ? (
            <p className='text-small-regular text-bg-secondary-1'>No suggestions yet.</p>
          ) : (
            suggestedUsers.map((u) => (
              <UserCard
                key={u.authId}
                id={u.authId}
                name={u.name}
                username={u.username}
                imgUrl={u.image}
                personType='user'
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
