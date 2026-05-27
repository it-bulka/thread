import { currentUser } from '@clerk/nextjs'
import { fetchSuggestedCommunities } from '@/services'
import { CommunityCard } from '@/components/cards/CommunityCard'
import { ISuggestedCommunity } from '@/types'

export const RightSidebar = async () => {
  const user = await currentUser()

  const result = user ? await fetchSuggestedCommunities(user.id) : null
  const suggested: ISuggestedCommunity[] = result?.ok ? result.data : []

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
          {/* TODO: add suggested Users */}
        </div>
      </div>
    </section>
  )
}
