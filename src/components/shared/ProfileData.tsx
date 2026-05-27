import { ProfileHeader } from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/consts';
import Image from 'next/image';
import { ThreadTab } from '@/components/shared/ThreadTab';
import { IUserRes } from '@/types';

interface IProfileDataProps {
  currentUser: Pick<IUserRes, "username" | "name" | "bio" | "image" | "authId" | "threads">
  userId: string
}

export const ProfileData = ({ currentUser, userId }: IProfileDataProps) => {
  return (
    <section>
      <ProfileHeader
        currentUserId={currentUser.authId}
        authUserId={userId}
        name={currentUser.name}
        username={currentUser.username}
        imgUrl={currentUser.image}
        bio={currentUser.bio}
      />

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
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
                  <p className='ml-1 rounded-sm bg-bg-reverse-4 px-2 py-1 !text-tiny-medium text-bg-reverse-2'>
                    {currentUser.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-bg-reverse-1'
            >
              <ThreadTab
                ownerId={userId}
                currentUserId={currentUser.authId}
                accountType='user'
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}