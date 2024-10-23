'use client';

import { useSearchParams } from 'next/navigation';
import SearchResults from '../SearchResults';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const route = searchParams.get('route');
  const departureDate = searchParams.get('departureDate');

  return <SearchResults route={route} departureDate={departureDate} />;
}