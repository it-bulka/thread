'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { sidebarLinks } from '@/consts';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'

export const LeftSidebar = () => {
  const pathName = usePathname()
  const [pendingRoute, setPendingRoute] = useState<string | null>(null)

  useEffect(() => {
    setPendingRoute(null)
  }, [pathName])

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map(link => {
          const active = pendingRoute ?? pathName
          const isActive = (active.includes(link.route) && link.route.length > 1) || active === link.route

          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn('leftsidebar_link', { 'bg-primary-500': isActive })}
              onClick={() => setPendingRoute(link.route)}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className='text-light-1 hidden lg:inline-block'>{link.label}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}