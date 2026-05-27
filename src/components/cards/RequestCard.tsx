'use client'
import { useTransition } from 'react'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { toast } from 'sonner'
import { approveRequest, denyRequest } from '@/services'
import { Button } from '@/components/ui/button'

interface IRequestCardProps {
  userId: string
  name: string
  username: string
  image: string
  communityAuthId: string
}

export const RequestCard = ({ userId, name, username, image, communityAuthId }: IRequestCardProps) => {
  const [isPending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveRequest({ communityId: communityAuthId, userId })
      if (!result.ok) toast.error(result.error)
      else toast.success(`${name} approved`)
    })
  }

  const handleDeny = () => {
    startTransition(async () => {
      const result = await denyRequest({ communityId: communityAuthId, userId })
      if (!result.ok) toast.error(result.error)
      else toast.success(`Request from ${name} denied`)
    })
  }

  return (
    <article className='user-card'>
      <div className='user-card_avatar'>
        <div className='relative h-12 w-12'>
          <UserAvatar
            src={image}
            alt='user_logo'
            fill
            sizes='100%'
            className='rounded-full object-cover'
          />
        </div>
        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>{name}</h4>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>

      <div className='flex gap-2'>
        <Button onClick={handleApprove} disabled={isPending} size='sm' className='user-card_btn'>
          Approve
        </Button>
        <Button onClick={handleDeny} disabled={isPending} size='sm' variant='destructive' className='user-card_btn'>
          Deny
        </Button>
      </div>
    </article>
  )
}
