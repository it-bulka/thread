import { checkExistedUser } from '@/lib/utils';
import { AccountProfile } from '@/components/forms/AccountProfile';

export default async function ProfileEdit () {
  const user = await checkExistedUser()
  if (!user) return null

  return (
    <section className='scroll-area-content'>
      <h1 className='head-text'>Edit Profile</h1>
      <p className='mt-3 text-base-regular text-bg-reverse-2'>Make any changes</p>

      <div className='mt-12'>
        <AccountProfile btnTitle='Continue' user={user} />
      </div>
    </section>
  )
}