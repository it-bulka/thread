import { ProfileHeader } from '@/components/shared/ProfileHeader'
import { checkExistedUser } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { communityTabs } from '@/consts';
import { ThreadTab } from '@/components/shared/ThreadTab';
import Image from 'next/image';
import { fetchCommunityDetails } from '@/services';
import { UserCard } from '@/components/cards/UserCard';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

export default async function Community ({ params }: {params: { id: string }}) {
  const user = await checkExistedUser()
  if(!user) return null

  const communityResult = await fetchCommunityDetails({ authOrganizationId: params.id })
  if (!communityResult.ok) return <ErrorMessage message={communityResult.error} />
  const communityDetails = communityResult.data

  return (
    <section>
      <ProfileHeader
        currentUserId={communityDetails.createdBy.authId}
        authUserId={user.authId}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type='community'
      />

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='hidden md:block'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-bg-reverse-1 px-2 py-1 !text-tiny-medium text-bg-reverse-2'>
                    {communityDetails.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-bg-reverse-1'>
            <ThreadTab
              ownerId={communityDetails.authOrganizationId}
              accountType='community'
            />
          </TabsContent>

          <TabsContent value='members' className='mt-9 w-full text-bg-reverse-1'>
            <section className='mt-9 flex flex-col gap-10'>
              {communityDetails.members.map((member) => (
                <UserCard
                  key={member.authId}
                  id={member.authId}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType='user'
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value='requests' className='w-full text-bg-reverse-1'>
            <ThreadTab
              ownerId={communityDetails._id}
              accountType='community'
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}