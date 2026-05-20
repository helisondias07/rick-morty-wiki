import type { ApiResponse, Location, LocationFilters } from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';

export async function getLocations(
  page: number = 1,
  filters: LocationFilters = {},
  signal?: AbortSignal
): Promise<ApiResponse<Location>> {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.name) params.set('name', filters.name);
  if (filters.type) params.set('type', filters.type);
  if (filters.dimension) params.set('dimension', filters.dimension);

  const res = await fetch(`${BASE_URL}/location?${params}`, { signal });
  if (!res.ok) {
    if (res.status === 404) return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
    throw new Error(`Failed to fetch locations: ${res.status}`);
  }
  return res.json();
}
