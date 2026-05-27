'use client'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { requestToJoin, deleteMemberFromCommunity } from '@/services'

interface IJoinButtonProps {
  communityAuthId: string
  currentUserAuthId: string
  isMember: boolean
  hasPendingRequest: boolean
}

export const JoinButton = ({ communityAuthId, currentUserAuthId, isMember, hasPendingRequest }: IJoinButtonProps) => {
  const [isPending, startTransition] = useTransition()

  const handleJoin = () => {
    startTransition(async () => {
      const result = await requestToJoin({ communityId: communityAuthId, userId: currentUserAuthId })
      if (!result.ok) toast.error(result.error)
      else toast.success('Request sent!')
    })
  }

  const handleLeave = () => {
    startTransition(async () => {
      const result = await deleteMemberFromCommunity({ communityId: communityAuthId, userId: currentUserAuthId })
      if (!result.ok) toast.error(result.error)
      else toast.success('Left community')
    })
  }

  if (isMember) {
    return (
      <Button onClick={handleLeave} disabled={isPending} variant='outline' size='sm'>
        Leave
      </Button>
    )
  }

  if (hasPendingRequest) {
    return (
      <Button disabled size='sm' className='opacity-60'>
        Pending…
      </Button>
    )
  }

  return (
    <Button onClick={handleJoin} disabled={isPending} size='sm'>
      Join Community
    </Button>
  )
}
