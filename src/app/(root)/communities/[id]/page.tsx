import { ProfileHeader } from '@/components/shared/ProfileHeader'
import { checkExistedUser } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { communityTabs } from '@/consts';
import { ThreadTab } from '@/components/shared/ThreadTab';
import { RequestsTab } from '@/components/shared/RequestsTab';
import { JoinButton } from '@/components/shared/JoinButton';
import { PrivacyToggle } from '@/components/shared/PrivacyToggle';
import { TabBadge } from '@/components/shared/TabBadge';
import Image from 'next/image';
import { fetchCommunityDetails, checkCommunityAccess } from '@/services';
import { UserCard } from '@/components/cards/UserCard';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

export default async function Community ({ params }: {params: { id: string }}) {
  const user = await checkExistedUser()
  if(!user) return null

  const [communityResult, accessResult] = await Promise.all([
    fetchCommunityDetails({ authOrganizationId: params.id }),
    checkCommunityAccess({ communityAuthId: params.id, userAuthId: user.authId }),
  ])
  if (!communityResult.ok) return <ErrorMessage message={communityResult.error} />
  const communityDetails = communityResult.data
  const { isMember, hasPendingRequest } = accessResult.ok
    ? accessResult.data
    : { isMember: false, hasPendingRequest: false }

  const isCreator = communityDetails.createdBy.authId === user.authId

  const visibleTabs = isCreator
    ? communityTabs
    : communityTabs.filter(t => t.value !== 'requests')

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
        rightContent={isCreator ? (
          <PrivacyToggle
            communityAuthId={communityDetails.authOrganizationId}
            initialIsPrivate={communityDetails.isPrivate}
          />
        ) : undefined}
      />

      {!isCreator && (
        <div className='mt-4 flex justify-end'>
          <JoinButton
            communityAuthId={communityDetails.authOrganizationId}
            currentUserAuthId={user.authId}
            isMember={isMember}
            hasPendingRequest={hasPendingRequest}
          />
        </div>
      )}

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='h-6 w-6 object-contain'
                />
                <p className='hidden md:block'>{tab.label}</p>

                {tab.value === 'threads' && (
                  <TabBadge count={communityDetails.threads.length} />
                )}

                {tab.value === 'requests' && communityDetails.joinRequests.length > 0 && (
                  <TabBadge count={communityDetails.joinRequests.length} />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-bg-reverse-1'>
            <ThreadTab
              ownerId={communityDetails.authOrganizationId}
              currentUserId={user.authId}
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

          {isCreator && (
            <TabsContent value='requests' className='w-full text-bg-reverse-1'>
              <RequestsTab
                communityAuthId={communityDetails.authOrganizationId}
                requests={communityDetails.joinRequests}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  )
}
