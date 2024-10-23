'use client';

import { useSearchParams } from 'next/navigation';
import SearchResults from './SearchResults';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const route1 = searchParams.get('route1');
  const route2 = searchParams.get('route2');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');

  return <SearchResults route1={route1} route2={route2} departureDate={departureDate} returnDate={returnDate} />;
}