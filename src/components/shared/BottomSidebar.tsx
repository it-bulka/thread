'use client'
import { useState, useEffect } from 'react';
import { sidebarLinks } from '@/consts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
export const BottomSidebar = () => {
  const pathName = usePathname()
  const [pendingRoute, setPendingRoute] = useState<string | null>(null)

  useEffect(() => {
    setPendingRoute(null)
  }, [pathName])

  return (
    <section className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => {
          const active = pendingRoute ?? pathName
          const isActive = (active.includes(link.route) && link.route.length > 1) || active === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
              onClick={() => setPendingRoute(link.route)}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className='object-contain'
              />

              <p className='text-subtle-medium text-bg-reverse-1 hidden md:inline-block'>
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  )
}