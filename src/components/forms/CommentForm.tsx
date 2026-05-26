'use client'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod'
import { CommentValidation } from '@/lib/validations/ThreadValidation';
import Image from 'next/image';
import { addCommentToThread } from '@/services/thread';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface ICommentForm {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

export const CommentForm = ({ threadId, currentUserId, currentUserImg }: ICommentForm) => {
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: ''
    }
  })

  const pathname = usePathname()

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await addCommentToThread({
      threadId,
      comment: data.thread,
      userId: currentUserId,
      path: pathname
    })

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    form.reset()
  })

  return (
    <Form {...form}>
      <form className='comment-form' onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  {...field}
                  placeholder='Comment...'
                  className='no-focus text-bg-reverse-1 outline-none'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  )
}