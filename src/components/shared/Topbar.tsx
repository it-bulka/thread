import Link from 'next/link';
import Image from 'next/image';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { LogoutButton } from '@/components/shared/LogoutButton';

export const Topbar = () => {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/logo.svg' alt='logo' width={28} height={28}/>
        <p className='text-heading3-bold text-bg-reverse-1 hidden sm:block'>Threads</p>
      </Link>

      <div className='flex items-center gap-1'>
        <div className='block md:hidden'>
          <LogoutButton className='flex cursor-pointer' />
        </div>

        {/* TODO: fix visibility of switcher btn */}
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
        }} />
      </div>
    </nav>
  )
}