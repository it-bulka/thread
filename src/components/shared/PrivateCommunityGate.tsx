'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { requestToJoin } from '@/services'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface IPrivateCommunityGateProps {
  communityAuthId: string
  communityName: string
  currentUserAuthId: string
  hasPendingRequest: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PrivateCommunityGate = ({
  communityAuthId,
  communityName,
  currentUserAuthId,
  hasPendingRequest,
  open,
  onOpenChange,
}: IPrivateCommunityGateProps) => {
  const [requested, setRequested] = useState(hasPendingRequest)
  const [isPending, startTransition] = useTransition()

  const handleRequest = () => {
    startTransition(async () => {
      const result = await requestToJoin({ communityId: communityAuthId, userId: currentUserAuthId })
      if (!result.ok) {
        toast.error(result.error)
      } else {
        setRequested(true)
        toast.success('Request sent!')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-bg-2 border-dark-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-bg-reverse-1 flex items-center gap-2'>
            <span>🔒</span> Private Community
          </DialogTitle>
          <DialogDescription className='text-bg-secondary-1'>
            <strong className='text-bg-reverse-2'>{communityName}</strong> is a private community.
            You need to be a member to post or comment here.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='border-dark-4 text-bg-reverse-2'
          >
            Cancel
          </Button>

          {requested ? (
            <Button disabled className='opacity-60'>
              Request Pending…
            </Button>
          ) : (
            <Button onClick={handleRequest} disabled={isPending}>
              {isPending ? 'Sending…' : 'Request to Join'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
