import Link from 'next/link';
import { Pages } from '@/consts';
import Image from 'next/image';
import { formatDateString, cn } from '@/lib/utils';
import { LikeButton } from '@/components/cards/LikeButton';
import MentionText from '@/components/ui/MentionText';

interface IThreadCardProps {
  id: string
  currentUserId: string
  parentId?: string
  content: string
  author: {
    name: string;
    image: string;
    authId: string;
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
}
export const ThreadCard = ({
  id, currentUserId, parentId, content, author, community, createdAt, comments, isComment, likes
}: IThreadCardProps) => {

  return (
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
              <Image
                src={author.image}
                alt='user_community_image'
                fill
                sizes="100%"
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar'/>
          </div>

          <div className='flex w-full flex-col'>
            <div className='flex items-center justify-between'>
              <Link href={`/profile/${author.authId}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-bg-reverse-1">
                  {author.name}
                </h4>
              </Link>

              <p className="text-subtle-medium text-bg-secondary-1">
                {formatDateString(createdAt)}
              </p>
            </div>

            <MentionText text={content} className="mt-2 text-small-regular text-bg-reverse-2" />

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                <LikeButton
                  threadId={String(id)}
                  currentUserId={currentUserId}
                  initialLikes={likes ?? []}
                  path={`/thread/${id}`}
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className='mt-1 text-subtle-medium text-bg-secondary-1'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* TODO: add delete thread */}
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 2).map((comment, index) => (
            <Image
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
      )}

      {!isComment && community && (
        <Link
          href={`${Pages.COMMUNITIES}/${community.authOrganizationId}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-bg-secondary-1'>
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className='ml-1 rounded-full object-cover'
          />
        </Link>
      )}
    </article>
  )
}