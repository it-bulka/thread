import Link from 'next/link';
import { Pages } from '@/consts';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { formatDateString } from '@/lib/utils';

interface IThreadCardCommunityProps {
  community: {
    authOrganizationId: string;
    name: string;
    image: string;
  }
  createdAt: string;
}

export const ThreadCardCommunity = ({ community, createdAt }: IThreadCardCommunityProps) => (
  <Link
    href={`${Pages.COMMUNITIES}/${community.authOrganizationId}`}
    className='mt-5 flex items-center'
  >
    <p className='text-subtle-medium text-bg-secondary-1'>
      {formatDateString(createdAt)} - {community.name} Community
    </p>

    <UserAvatar
      src={community.image}
      alt={community.name}
      width={14}
      height={14}
      className='ml-1 rounded-full object-cover'
    />
  </Link>
)
