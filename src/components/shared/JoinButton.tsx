'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { requestToJoin, leaveCommunity, cancelJoinRequest } from '@/services'
import { CommunityButton } from '@/components/ui/CommunityButton'
import { useOrganizationList, useSession } from '@clerk/nextjs'

interface IJoinButtonProps {
  communityAuthId: string
  currentUserAuthId: string
  isMember: boolean
  hasPendingRequest: boolean
}

export const JoinButton = ({ communityAuthId, currentUserAuthId, isMember, hasPendingRequest }: IJoinButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const { userMemberships } = useOrganizationList({ userMemberships: true })
  const { session } = useSession()

  const handleJoin = () => {
    startTransition(async () => {
      const result = await requestToJoin({ communityId: communityAuthId, userId: currentUserAuthId })
      if (!result.ok) toast.error(result.error)
      else {
        toast.success('Request sent!')
        await session?.reload()
        userMemberships?.revalidate?.()
      }
    })
  }

  const handleLeave = () => {
    startTransition(async () => {
      const result = await leaveCommunity({ communityId: communityAuthId, userId: currentUserAuthId })
      if (!result.ok) toast.error(result.error)
      else {
        toast.success('Left community')
        await session?.reload()
        userMemberships?.revalidate?.()
      }
    })
  }

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelJoinRequest({ communityId: communityAuthId, userId: currentUserAuthId })
      if (!result.ok) toast.error(result.error)
      else toast.success('Request cancelled')
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
      <div className='flex flex-col items-center gap-2'>
        <p className='text-small-regular text-gray-1'>Request pending review</p>
        <CommunityButton variant='secondary' onClick={handleCancel} disabled={isPending}>
          Cancel Request
        </CommunityButton>
      </div>
    )
  }

  return (
    <CommunityButton variant='secondary' onClick={handleJoin} disabled={isPending}>
      Join Community
    </CommunityButton>
  )
}
