import Link from 'next/link';
import { Pages } from '@/consts';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface IThreadCardRepliesProps {
  id: string;
  comments: { author: { image: string } }[];
}

export const ThreadCardReplies = ({ id, comments }: IThreadCardRepliesProps) => (
  <div className='ml-1 mt-3 flex items-center gap-2'>
    {comments.slice(0, 2).map((comment, index) => (
      <UserAvatar
        key={index}
        src={comment.author.image}
        alt={`user_${index}`}
        width={24}
        height={24}
        className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
      />
    ))}

    <Link href={`${Pages.THREAD}/${id}`}>
      <p className='mt-1 text-subtle-medium text-bg-secondary-1'>
        {comments.length} repl{comments.length > 1 ? "ies" : "y"}
      </p>
    </Link>
  </div>
)
