import { checkExistedUser } from '@/lib/utils';
import { AccountProfile } from '@/components/forms/AccountProfile';
import { DeleteAccountButton } from '@/components/forms/DeleteAccountButton';

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

      <div className='mt-10 border-t border-bg-3 pt-8'>
        <h2 className='text-heading4-medium text-red-500'>Danger zone</h2>
        <p className='mt-2 text-small-regular text-bg-reverse-2'>
          After deleting your account, your threads will remain in the system marked as &quot;Account deleted&quot;.
        </p>
        <DeleteAccountButton authId={user.authId} />
      </div>
    </section>
  )
}