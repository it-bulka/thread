'use client'
import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import userDefaultImage from '@/assets/images/user-default.png'

interface IUserAvatarProps extends Omit<ImageProps, 'onError'> {
  defaultSrc?: ImageProps['src']
}

export const UserAvatar = ({ src, defaultSrc = userDefaultImage, ...props }: IUserAvatarProps) => {
  const [imgSrc, setImgSrc] = useState<ImageProps['src']>(src || defaultSrc)

  useEffect(() => {
    setImgSrc(src || defaultSrc)
  }, [src, defaultSrc])

  return (
    <Image
      alt=''
      {...props}
      src={imgSrc}
      onError={() => setImgSrc(defaultSrc)}
    />
  )
}
