'use client'
import Link from 'next/link';
import { Pages } from '@/consts';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { cn } from '@/lib/utils';
import { MentionText } from '@/components/ui/MentionText'
import { DeleteThreadButton } from '@/components/cards/DeleteThreadButton';
import { ThreadCardHeader } from '@/components/cards/ThreadCardHeader';
import { ThreadCardActions } from '@/components/cards/ThreadCardActions';
import { ThreadCardReplies } from '@/components/cards/ThreadCardReplies';
import { ThreadCardCommunity } from '@/components/cards/ThreadCardCommunity';

interface IThreadCardProps {
  id: string
  currentUserId: string | null
  parentId?: string
  content: string
  author: {
    name: string;
    image: string;
    authId: string;
    username: string;
  }
  community?: {
    authOrganizationId: string;
    name: string;
    image: string;
  }
  createdAt: string
  comments: {
    author: {
      image: string;
    };
  }[]
  isComment?: boolean
  likes?: string[]
  onDelete?: (id: string) => void
}

export const ThreadCard = ({
  id, currentUserId, parentId, content, author, community, createdAt, comments, isComment, likes, onDelete
}: IThreadCardProps) => (
  <article
    className={cn('flex w-full flex-col rounded-xl', {
      'px-0 xs:px-7': isComment,
      'bg-bg-2 p-7': !isComment
    })}
  >
    <div className='flex items-start justify-between'>
      <div className='flex w-full flex-1 flex-row gap-4'>
        <div className='flex flex-col items-center'>
          <Link href={`${Pages.PROFILE}/${author.authId}`} className='relative h-11 w-11'>
            <UserAvatar
              src={author.image}
              alt='user_community_image'
              fill
              sizes="100%"
              className='cursor-pointer rounded-full'
            />
          </Link>
          <div className='thread-card_bar' />
        </div>

        <div className='flex w-full flex-col'>
          <ThreadCardHeader author={author} createdAt={createdAt} />

          <p className="mt-2 text-small-regular text-bg-reverse-2">
            <MentionText text={content} />
          </p>

          <ThreadCardActions
            id={id}
            currentUserId={currentUserId}
            likes={likes ?? []}
            comments={comments}
            isComment={isComment}
          />
        </div>
      </div>

      {currentUserId === author.authId && (
        <DeleteThreadButton threadId={id} onDelete={onDelete} />
      )}
    </div>

    {!isComment && comments.length > 0 && (
      <ThreadCardReplies id={id} comments={comments} />
    )}

    {!isComment && community && (
      <ThreadCardCommunity community={community} createdAt={createdAt} />
    )}
  </article>
)
