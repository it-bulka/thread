import { CardButton } from '@/components/shared/CardButton';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface IUserCardProps {
  id: string
  name: string
  username: string
  imgUrl: string
  personType: 'community' | 'user'
}
export const UserCard = ({ id, name, username, imgUrl, personType }: IUserCardProps) => {
  const isCommunity = personType === 'community';
  return (
    <article className='user-card'>
      <div className='user-card_avatar'>
        <div className='relative h-12 w-12'>
          <UserAvatar
            src={imgUrl}
            alt='user_logo'
            fill
            sizes="100%"
            className='rounded-full object-cover'
          />
        </div>

        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>{name}</h4>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>

      <CardButton isCommunity={isCommunity} pathId={id} className='user-card_btn' />
    </article>
  )
}