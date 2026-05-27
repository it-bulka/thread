'use client'
import { useState, useTransition } from 'react'
import Image from 'next/image'
import { toggleLike } from '@/services/thread'
import { toast } from 'sonner'

interface ILikeButtonProps {
  threadId: string
  currentUserId: string
  initialLikes: string[]
  path: string
}

export const LikeButton = ({ threadId, currentUserId, initialLikes, path }: ILikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()
  const isLiked = likes.includes(currentUserId)

  const handleLike = () => {
    setLikes(prev =>
      isLiked ? prev.filter(id => id !== currentUserId) : [...prev, currentUserId]
    )
    startTransition(async () => {
      const result = await toggleLike({ threadId, userId: currentUserId, path })
      if (!result.ok) {
        setLikes(prev =>
          isLiked ? [...prev, currentUserId] : prev.filter(id => id !== currentUserId)
        )
        toast.error(result.error)
      }
    })
  }

  return (
    <button onClick={handleLike} disabled={isPending} className='flex items-center gap-1'>
      <Image
        src={isLiked ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
        alt='like'
        width={24}
        height={24}
        className='cursor-pointer object-contain'
      />
      {likes.length > 0 && (
        <span className='text-subtle-medium text-bg-secondary-1'>{likes.length}</span>
      )}
    </button>
  )
}
