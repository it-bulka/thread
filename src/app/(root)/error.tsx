'use client'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4'>
      <p className='text-heading3-bold text-light-1'>Сталася помилка</p>
      <p className='text-base-regular text-gray-1'>{error.message}</p>
      <button
        onClick={reset}
        className='community-card_btn'
      >
        Спробувати ще раз
      </button>
    </div>
  )
}
