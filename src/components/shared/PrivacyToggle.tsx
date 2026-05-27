'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { toggleCommunityPrivacy } from '@/services/communityMembership'
import { Switch } from '@/components/ui/switch'

interface IPrivacyToggleProps {
  communityAuthId: string
  initialIsPrivate: boolean
}

export const PrivacyToggle = ({ communityAuthId, initialIsPrivate }: IPrivacyToggleProps) => {
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleCommunityPrivacy({ communityAuthId })
      if (!result.ok) {
        toast.error(result.error)
      } else {
        setIsPrivate(result.data.isPrivate)
        toast.success(result.data.isPrivate ? 'Community set to Private' : 'Community set to Public')
      }
    })
  }

  return (
    <div className='flex items-center gap-2'>
      <Switch
        checked={isPrivate}
        onCheckedChange={handleToggle}
        disabled={isPending}
        id='privacy-toggle'
        className='data-[state=unchecked]:bg-bg-reverse-4 data-[state=checked]:bg-primary-500'
      />
      <label
        htmlFor='privacy-toggle'
        className='cursor-pointer text-small-regular text-bg-reverse-2'
      >
        {isPrivate ? '🔒 Private' : '🌐 Public'}
      </label>
    </div>
  )
}
