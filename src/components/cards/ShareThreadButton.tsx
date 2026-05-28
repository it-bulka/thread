'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Link2, Send, MessageCircle } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

interface IShareThreadButtonProps {
  threadId: string
}

const socialNetworks = [
  {
    name: 'Twitter / X',
    getUrl: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    className: 'bg-black text-white hover:bg-zinc-800',
    label: 'X',
  },
  {
    name: 'Telegram',
    getUrl: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    className: 'bg-[#2AABEE] text-white hover:bg-[#229ED9]',
    icon: Send,
  },
  {
    name: 'WhatsApp',
    getUrl: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
    className: 'bg-[#25D366] text-white hover:bg-[#1ebe57]',
    icon: MessageCircle,
  },
  {
    name: 'Facebook',
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    className: 'bg-[#1877F2] text-white hover:bg-[#1565D8]',
    label: 'f',
  },
]

export const ShareThreadButton = ({ threadId }: IShareThreadButtonProps) => {
  const [open, setOpen] = useState(false)

  const getThreadUrl = () => `${window.location.origin}/thread/${threadId}`

  const handleShare = async () => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

    if (isMobile && navigator.share) {
      try {
        await navigator.share({ url: getThreadUrl() })
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    setOpen(true)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getThreadUrl())
    toast.success('Link copied!')
    setOpen(false)
  }

  const handleSocial = (getUrl: (url: string) => string) => {
    window.open(getUrl(getThreadUrl()), '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <>
      <Image
        src='/assets/share.svg'
        alt='share'
        width={24}
        height={24}
        className='cursor-pointer object-contain'
        onClick={handleShare}
      />

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Share</DrawerTitle>
          </DrawerHeader>

          <div className='px-4 pb-6 flex flex-col gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              {socialNetworks.map((network) => {
                const Icon = network.icon
                return (
                  <button
                    key={network.name}
                    onClick={() => handleSocial(network.getUrl)}
                    className={`flex items-center gap-2 justify-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${network.className}`}
                  >
                    {Icon ? <Icon size={16} /> : (
                      <span className='font-bold text-base leading-none'>{network.label}</span>
                    )}
                    {network.name}
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleCopy}
              className='flex items-center gap-2 justify-center rounded-xl px-4 py-3 text-sm font-medium bg-bg-3 text-bg-reverse-1 hover:bg-bg-3/70 transition-colors'
            >
              <Link2 size={16} />
              Copy link
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
