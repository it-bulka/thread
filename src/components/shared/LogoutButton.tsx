'use client'
import Image from 'next/image'
import { SignedIn, SignOutButton } from '@clerk/nextjs'

interface ILogoutButtonProps {
  className?: string
  showLabel?: boolean
}

export const LogoutButton = ({ className, showLabel }: ILogoutButtonProps) => (
  <SignedIn>
    <SignOutButton>
      <button className={className}>
        <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
        {showLabel && <p className='text-light-1 hidden lg:inline-block'>Logout</p>}
      </button>
    </SignOutButton>
  </SignedIn>
)
