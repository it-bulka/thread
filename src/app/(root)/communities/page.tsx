import { Pagination } from '@/components/shared/Pagination';
import { SearchBar } from '@/components/shared/SearchBar';
import { CommunityCard } from '@/components/cards/CommunityCard';
import { checkExistedUser } from '@/lib/utils';
import { fetchCommunities } from '@/services';
import { SortOrder } from 'mongoose';
import { Pages } from '@/consts';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

interface SearchParams {
  search: string
  page: string
  perPage: string
  sortBy: SortOrder
}

export default async function Community ({ searchParams }: { searchParams: SearchParams }) {
  const currentUser = await checkExistedUser()
  if (!currentUser) return null

  const fetchResult = await fetchCommunities({
    searchString: searchParams.search,
    pageNumber: searchParams.page ? Number(searchParams.page) : 1,
    pageSize: 3,
    sortBy: 'desc'
  })

  if (!fetchResult.ok) return <ErrorMessage message={fetchResult.error} />
  const result = fetchResult.data

  return (
    <>
      <h1 className='head-text'>Communities</h1>

      <div className='mt-5'>
        <SearchBar placeholder='Search communties...' search={searchParams.search} path={Pages.COMMUNITIES} />
      </div>

      <section className='mt-9 flex flex-wrap gap-4'>
        {result.communities.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.authOrganizationId}
                authOrganizationId={community.authOrganizationId}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      {result.totalPages <= 1 ? null : (
        <Pagination
          totalPages={Number(result.totalPages)}
          activePage={Number(result.page)}
          path={Pages.COMMUNITIES}
        />
      )}
    </>
  )
}