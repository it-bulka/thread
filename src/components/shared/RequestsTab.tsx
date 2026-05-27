import { IUserRes } from '@/types'
import { RequestCard } from '@/components/cards/RequestCard'

interface IRequestsTabProps {
  communityAuthId: string
  requests: Pick<IUserRes, '_id' | 'authId' | 'name' | 'username' | 'image'>[]
}

export const RequestsTab = ({ communityAuthId, requests }: IRequestsTabProps) => {
  if (requests.length === 0) {
    return <p className='no-result'>No pending requests</p>
  }

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {requests.map((request) => (
        <RequestCard
          key={request.authId}
          userId={request.authId}
          name={request.name}
          username={request.username}
          image={request.image}
          communityAuthId={communityAuthId}
        />
      ))}
    </section>
  )
}
