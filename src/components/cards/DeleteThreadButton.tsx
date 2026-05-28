'use client'
import { useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { deleteThread } from '@/services/thread'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

interface IDeleteThreadButtonProps {
  threadId: string
  onDelete?: (id: string) => void
}

export const DeleteThreadButton = ({ threadId, onDelete }: IDeleteThreadButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      onDelete?.(threadId)
      const result = await deleteThread({ id: threadId, path: pathname })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      if (!onDelete) {
        router.push('/')
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='opacity-50 hover:opacity-100 transition-opacity'>
          <Image
            src='/assets/delete.svg'
            alt='delete'
            width={18}
            height={18}
            className='object-contain'
          />
        </button>
      </DialogTrigger>

      <DialogContent className='bg-bg-2 border-bg-3 max-w-sm'>
        <DialogHeader>
          <DialogTitle className='text-bg-reverse-1'>Delete thread?</DialogTitle>
          <DialogDescription className='text-bg-secondary-1'>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <button className='px-4 py-2 rounded-lg text-sm text-bg-secondary-1 hover:text-bg-reverse-1 transition-colors'>
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className='px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50'
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
