import { redirect } from 'next/navigation'
import { Pages } from '@/consts'

export default function ProfileRoot() {
  redirect(Pages.MY_PROFILE)
}
