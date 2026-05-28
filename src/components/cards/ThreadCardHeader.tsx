import Link from 'next/link';
import { formatDateString } from '@/lib/utils';

interface IThreadCardHeaderProps {
  author: {
    name: string;
    authId: string;
    username: string;
  }
  createdAt: string;
}

export const ThreadCardHeader = ({ author, createdAt }: IThreadCardHeaderProps) => (
  <div className='flex items-center justify-between'>
    <Link href={`/profile/${author.authId}`} className="w-fit">
      <h4 className="cursor-pointer text-base-semibold text-bg-reverse-1">{author.name}</h4>
      <p className='text-small-medium text-gray-1 opacity-50'>@{author.username}</p>
    </Link>

    <p className="text-subtle-medium text-bg-secondary-1">
      {formatDateString(createdAt)}
    </p>
  </div>
)
