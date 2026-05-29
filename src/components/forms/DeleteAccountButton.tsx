'use client'
import { useTransition } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteCurrentUserAccount } from '@/services'
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

interface IDeleteAccountButtonProps {
  authId: string
}

export const DeleteAccountButton = ({ authId }: IDeleteAccountButtonProps) => {
  const { signOut } = useClerk()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCurrentUserAccount(authId)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      await signOut()
      router.push('/sign-in')
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='mt-4 w-full rounded-lg border border-red-600 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-600 hover:text-white'>
          Delete account
        </button>
      </DialogTrigger>

      <DialogContent className='bg-bg-2 border-bg-3 max-w-sm'>
        <DialogHeader>
          <DialogTitle className='text-bg-reverse-1'>Delete account?</DialogTitle>
          <DialogDescription className='text-bg-secondary-1'>
            This action cannot be undone. Your account will be permanently deleted, and your threads will remain marked as "Account deleted".
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
            {isPending ? 'Deleting...' : 'Delete account'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
