interface ErrorMessageProps {
  message?: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className='rounded-lg border border-red-800 bg-dark-4 p-4 text-center'>
      <p className='text-base-semibold text-red-400'>
        {message ?? 'Не вдалося завантажити дані'}
      </p>
    </div>
  )
}
