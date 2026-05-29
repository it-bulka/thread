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
import { useRouter } from 'next/navigation';
import { Pages } from '@/consts';
import { toast } from 'sonner';
import { ICommunityAccessStatus } from '@/types';
import { PrivateCommunityGate } from '@/components/shared/PrivateCommunityGate';
import { IUserMemberCommunity } from '@/services/communities';

interface IThreadFormProps {
  authorId: string
  communities: IUserMemberCommunity[]
}

export const ThreadForm = ({ authorId, communities }: IThreadFormProps) => {
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: { thread: '', authorId }
  })

  const pathname = usePathname()
  const router = useRouter()

  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null)
  const [accessStatus, setAccessStatus] = useState<ICommunityAccessStatus | null>(null)
  const [gateOpen, setGateOpen] = useState(false)
  const [, startAccessCheck] = useTransition()

  useEffect(() => {
    if (!selectedCommunityId) {
      setAccessStatus(null)
      return
    }
    startAccessCheck(async () => {
      const result = await checkCommunityAccess({ communityAuthId: selectedCommunityId, userAuthId: authorId })
      if (result.ok) setAccessStatus(result.data)
    })
  }, [selectedCommunityId, authorId])

  const isBlocked = accessStatus?.isPrivate && !accessStatus?.isMember

  const selectedCommunity = communities.find(c => c.authOrganizationId === selectedCommunityId) ?? null

  const onSubmit: SubmitHandler<z.infer<typeof ThreadValidation>> = async (value) => {
    if (isBlocked) {
      setGateOpen(true)
      return
    }

    const result = await createThread({
      text: value.thread,
      author: value.authorId,
      path: pathname,
      communityId: selectedCommunityId ?? undefined
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
          {communities.length > 0 && (
            <div className='mb-4 flex flex-col gap-3'>
              <label className='text-base-semibold text-bg-reverse-2'>Post to</label>
              <select
                value={selectedCommunityId ?? ''}
                onChange={e => setSelectedCommunityId(e.target.value || null)}
                className='no-focus border border-dark-4 bg-bg-3 text-bg-reverse-1 rounded px-3 py-2 w-full'
              >
                <option value=''>Personal (no community)</option>
                {communities.map(c => (
                  <option key={c.authOrganizationId} value={c.authOrganizationId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isBlocked ? (
            <div className='flex flex-col items-center gap-4 py-10 text-center'>
              <span className='text-4xl'>🔒</span>
              <p className='text-base-semibold text-bg-reverse-2'>Private community</p>
              <p className='text-small-regular text-gray-1'>
                You need to join before posting.
              </p>
              <Button
                type='submit'
                className='bg-primary-500'
                disabled={accessStatus?.hasPendingRequest}
              >
                {accessStatus?.hasPendingRequest ? 'Request Pending…' : 'Request to Join'}
              </Button>
            </div>
          ) : (
            <>
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
              <Button type='submit' className='bg-primary-500 ml-auto mr-0 flex max-w-max mt-3'>
                Post Thread
              </Button>
            </>
          )}
        </form>
      </Form>

      {isBlocked && selectedCommunity && (
        <PrivateCommunityGate
          communityAuthId={selectedCommunity.authOrganizationId}
          communityName={selectedCommunity.name}
          currentUserAuthId={authorId}
          hasPendingRequest={accessStatus?.hasPendingRequest ?? false}
          open={gateOpen}
          onOpenChange={setGateOpen}
        />
      )}
    </>
  )
}
