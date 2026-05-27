'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { requestToJoin, deleteMemberFromCommunity } from '@/services'
import { CommunityButton } from '@/components/ui/CommunityButton'

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
      <CommunityButton variant='secondary' onClick={handleLeave} disabled={isPending}>
        Leave Community
      </CommunityButton>
    )
  }

  if (hasPendingRequest) {
    return (
      <CommunityButton variant='secondary' disabled>
        Pending…
      </CommunityButton>
    )
  }

  return (
    <CommunityButton variant='secondary' onClick={handleJoin} disabled={isPending}>
      Join Community
    </CommunityButton>
  )
}
