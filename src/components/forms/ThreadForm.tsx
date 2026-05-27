'use client'
import { useState, useEffect, useTransition } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { ThreadValidation } from '@/lib/validations';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createThread } from '@/services/thread';
import { checkCommunityAccess } from '@/services/communityMembership';
import { usePathname } from 'next/navigation';
import { useOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Pages } from '@/consts';
import { toast } from 'sonner';
import { ICommunityAccessStatus } from '@/types';
import { PrivateCommunityGate } from '@/components/shared/PrivateCommunityGate';

export const ThreadForm = ({ authorId }: { authorId: string }) => {
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: { thread: '', authorId }
  })

  const pathname = usePathname()
  const router = useRouter()
  const { organization } = useOrganization()

  const [accessStatus, setAccessStatus] = useState<ICommunityAccessStatus | null>(null)
  const [gateOpen, setGateOpen] = useState(false)
  const [, startAccessCheck] = useTransition()

  useEffect(() => {
    if (!organization?.id) {
      setAccessStatus(null)
      return
    }
    startAccessCheck(async () => {
      const result = await checkCommunityAccess({ communityAuthId: organization.id, userAuthId: authorId })
      if (result.ok) setAccessStatus(result.data)
    })
  }, [organization?.id, authorId])

  const isBlocked = accessStatus?.isPrivate && !accessStatus?.isMember

  const onSubmit: SubmitHandler<z.infer<typeof ThreadValidation>> = async (value) => {
    if (isBlocked) {
      setGateOpen(true)
      return
    }

    const result = await createThread({
      text: value.thread,
      author: value.authorId,
      path: pathname,
      communityId: organization?.id || undefined
    })

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    router.push(`${Pages.THREAD}/${result.data._id}`)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='thread'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-bg-reverse-2'>
                  Content
                </FormLabel>
                <FormControl className='no-focus border border-dark-4 bg-bg-3 text-bg-reverse-1'>
                  <Textarea rows={15} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isBlocked && (
            <p className='mt-2 flex items-center gap-1.5 text-small-regular text-gray-1'>
              <span>🔒</span>
              This is a private community — you need to join before posting.
            </p>
          )}

          <Button type='submit' className='bg-primary-500 ml-auto mr-0 flex max-w-max mt-3'>
            {isBlocked ? 'Request to Join' : 'Post Thread'}
          </Button>
        </form>
      </Form>

      {isBlocked && organization && (
        <PrivateCommunityGate
          communityAuthId={organization.id}
          communityName={organization.name ?? organization.id}
          currentUserAuthId={authorId}
          hasPendingRequest={accessStatus?.hasPendingRequest ?? false}
          open={gateOpen}
          onOpenChange={setGateOpen}
        />
      )}
    </>
  )
}
