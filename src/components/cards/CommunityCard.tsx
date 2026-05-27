import Link from 'next/link';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { CommunityButton } from '@/components/ui/CommunityButton';
import { Pages } from '@/consts';

interface ICommunityCard {
  authOrganizationId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  members: {
    image: string;
  }[];
}

export const CommunityCard = ({ authOrganizationId, name, username, imgUrl, bio, members }: ICommunityCard) => {
  return (
    <article className='community-card'>
      <div className='flex flex-wrap items-center gap-3'>
        <Link href={`${Pages.COMMUNITIES}/${authOrganizationId}`} className='relative h-12 w-12'>
          <UserAvatar
            src={imgUrl}
            alt='community_logo'
            fill
            sizes="100%"
            className='rounded-full object-cover'
          />
        </Link>

        <div>
          <Link href={`${Pages.COMMUNITIES}/${authOrganizationId}`}>
            <h4 className='text-base-semibold text-bg-reverse-1'>{name}</h4>
          </Link>
          <p className='text-small-medium text-bg-secondary-1'>@{username}</p>
        </div>
      </div>

      <p className='mt-4 text-subtle-medium text-bg-secondary-1'>{bio}</p>

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <Link href={`${Pages.COMMUNITIES}/${authOrganizationId}`}>
          <CommunityButton>
            View
          </CommunityButton>
        </Link>

        {members.length > 0 && (
          <div className='flex items-center'>
            {members.map((member, index) => (
              <UserAvatar
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover`}
              />
            ))}
            {members.length > 3 && (
              <p className='ml-1 text-subtle-medium text-bg-secondary-1'>
                {members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}