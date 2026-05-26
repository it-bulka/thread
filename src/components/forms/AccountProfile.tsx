'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { ChangeEvent, useState } from 'react';
import { updateUser } from '@/services';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image'
import { UserValidation } from '@/lib/validations';
import { useUploadThing } from '@/lib/uploadthing';
import { Pages } from '@/consts';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface AccountProfileProps {
  user: {
    authId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export const AccountProfile = ({ user, btnTitle }: AccountProfileProps) => {
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user.image || "",
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || ""
    }
  })

  const [img, setImg] = useState<File | undefined>()
  const { startUpload } = useUploadThing('image')
  const router = useRouter()
  const pathname = usePathname()

  const onSubmit: SubmitHandler<z.infer<typeof UserValidation>> = async (data) => {
    const { authId } = user
    const { username, name, bio } = data
    /* TODO: delete old photo profile */
    if (img) {
      const imgRes = await startUpload([img])
      const fileUrl = imgRes?.[0].url
      if (fileUrl) {
        data.profile_photo = fileUrl
      }
    }

    const result = await updateUser({
      authId,
      username,
      name,
      bio,
      image: data.profile_photo,
    })

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    if (pathname === Pages.PROFILE_EDIT) {
      router.back()
    } else {
      router.push(Pages.HOME)
    }
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    changeImgField: (value: string) => void
  ) => {
    const file =  e.target.files?.[0]

    if (!file || !file.type.includes("image")) return

    const reader = new FileReader();
    reader.onloadend = function () {
      const base64data = reader.result?.toString() || '';
      changeImgField(base64data)
    };
    reader.readAsDataURL(file);
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  )
}