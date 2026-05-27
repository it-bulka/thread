import { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CommunityButtonProps extends Omit<ComponentProps<typeof Button>, 'variant'> {
  variant?: 'primary' | 'secondary'
}

export const CommunityButton = ({ variant = 'primary', className, ...props }: CommunityButtonProps) => (
  <Button
    size='sm'
    className={cn(variant === 'primary' && 'community-card_btn', className)}
    {...props}
  />
)
