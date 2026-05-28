import Link from 'next/link';
import Image from 'next/image';
import { LikeButton } from '@/components/cards/LikeButton';
import { ShareThreadButton } from '@/components/cards/ShareThreadButton';

interface IThreadCardActionsProps {
  id: string;
  currentUserId: string | null;
  likes: string[];
  comments: { author: { image: string } }[];
  isComment?: boolean;
}

export const ThreadCardActions = ({ id, currentUserId, likes, comments, isComment }: IThreadCardActionsProps) => (
  <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
    <div className='flex gap-3.5'>
      <LikeButton
        threadId={id}
        currentUserId={currentUserId}
        initialLikes={likes}
        path={`/thread/${id}`}
      />
      <Link href={`/thread/${id}`}>
        <Image
          src='/assets/reply.svg'
          alt='reply'
          width={24}
          height={24}
          className='cursor-pointer object-contain'
        />
      </Link>
      {/* TODO: implement repost functionality */}
      {/* <Image
        src='/assets/repost.svg'
        alt='repost'
        width={24}
        height={24}
        className='cursor-pointer object-contain'
      /> */}
      <ShareThreadButton threadId={id} />
    </div>

    {isComment && comments.length > 0 && (
      <Link href={`/thread/${id}`}>
        <p className='mt-1 text-subtle-medium text-bg-secondary-1'>
          {comments.length} repl{comments.length > 1 ? "ies" : "y"}
        </p>
      </Link>
    )}
  </div>
)
