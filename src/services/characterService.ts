import type { ApiResponse, Character, CharacterFilters } from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';

export async function getCharacters(
  page: number = 1,
  filters: CharacterFilters = {},
  signal?: AbortSignal
): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.name) params.set('name', filters.name);
  if (filters.status) params.set('status', filters.status);
  if (filters.species) params.set('species', filters.species);

  const res = await fetch(`${BASE_URL}/character?${params}`, { signal });
  if (!res.ok) {
    if (res.status === 404) return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
    throw new Error(`Failed to fetch characters: ${res.status}`);
  }
  return res.json();
}

export async function getCharactersByIds(
  ids: number[],
  signal?: AbortSignal
): Promise<Character[]> {
  if (ids.length === 0) return [];
  const url =
    ids.length === 1
      ? `${BASE_URL}/character/${ids[0]}`
      : `${BASE_URL}/character/${ids.join(',')}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Failed to fetch characters by ids: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}
