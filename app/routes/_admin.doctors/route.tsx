import type { DoctorsQuery, DoctorsQueryVariables } from '~/gql/graphql'
import { useApolloClient } from '@apollo/client'
import { useEffect, useState } from 'react'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import useGetDoctors from '~/hooks/use-get-doctors'
import { filterDoctors } from './doctor-filters'
import DoctorsAdd from './doctors-add'
import DoctorsList from './doctors-list'

type Doctor = DoctorsQuery['doctors']['data'][number]
const PAGE_SIZE = 10
const SEARCH_FETCH_SIZE = 100

export default function AdminDoctors() {
  const client = useApolloClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [allDoctors, setAllDoctors] = useState<Doctor[] | null>(null)
  const [searchError, setSearchError] = useState<Error | null>(null)
  const { data, loading, error, refetch } = useGetDoctors({ first: PAGE_SIZE, page: search.trim() ? 1 : page })
  const searchActive = !!search.trim()

  useEffect(() => {
    if (!searchActive || allDoctors || searchError)
      return

    let cancelled = false
    const loadDoctors = async () => {
      try {
        const fetchPage = async (pageNumber: number) => {
          const response = await client.query<DoctorsQuery, DoctorsQueryVariables>({
            query: DOCTORS_QUERY,
            variables: { first: SEARCH_FETCH_SIZE, page: pageNumber },
            fetchPolicy: 'network-only',
          })
          return response.data.doctors
        }
        const firstPage = await fetchPage(1)
        const remainingPages = await Promise.all(Array.from(
          { length: Math.max(0, firstPage.paginatorInfo.lastPage - 1) },
          (_, index) => fetchPage(index + 2),
        ))
        if (!cancelled)
          setAllDoctors([firstPage, ...remainingPages].flatMap(result => result.data))
      }
      catch (cause) {
        if (!cancelled)
          setSearchError(cause instanceof Error ? cause : new Error('Could not search doctors.'))
      }
    }

    void loadDoctors()
    return () => {
      cancelled = true
    }
  }, [allDoctors, client, searchActive, searchError])

  const matchingDoctors = searchActive ? filterDoctors(allDoctors ?? [], search) : []
  const searchPageCount = Math.max(1, Math.ceil(matchingDoctors.length / PAGE_SIZE))
  const visibleDoctors = searchActive && allDoctors
    ? {
        data: matchingDoctors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        paginatorInfo: { lastPage: searchPageCount, total: matchingDoctors.length },
      }
    : data?.doctors
  const updateSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }
  const refreshDoctors = async () => {
    setAllDoctors(null)
    setSearchError(null)
    await refetch()
  }

  return (
    <div className="mx-auto my-4 flex w-full max-w-390 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <DoctorsAdd onCreated={refreshDoctors} />
      </div>
      <DoctorsList
        doctors={visibleDoctors}
        loading={searchActive ? !allDoctors && !searchError : loading}
        error={searchActive ? searchError ?? undefined : error}
        page={page}
        search={search}
        onPageChange={setPage}
        onSearchChange={updateSearch}
        onUpdated={refreshDoctors}
        onDeleted={refreshDoctors}
        onRetry={() => {
          // Query errors are displayed by the list.
          if (searchActive)
            setSearchError(null)
          else
            void refreshDoctors().catch(() => {})
        }}
      />
    </div>
  )
}
