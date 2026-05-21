import type { ApiResponse, Character, CharacterFilters } from '../types';

const BASE_URL = '/api/rick-morty';
const RETRYABLE_STATUS = new Set([408, 425, 500, 502, 503, 504]);

export class RateLimitError extends Error {
  retryAfterMs: number;

  constructor(retryAfterMs = 8000) {
    super('Rate limit reached');
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timeout = globalThis.setTimeout(resolve, ms);

    signal?.addEventListener(
      'abort',
      () => {
        globalThis.clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

async function fetchWithRetry(
  url: string,
  signal?: AbortSignal,
  attempts = 3
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!RETRYABLE_STATUS.has(response.status) || attempt === attempts - 1) {
        return response;
      }
    } catch (error) {
      if (isAbortError(error) || attempt === attempts - 1) {
        throw error;
      }

      lastError = error;
    }

    await wait(500 * (attempt + 1), signal);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Failed to fetch characters');
}

export async function getCharacters(
  page: number = 1,
  filters: CharacterFilters = {},
  signal?: AbortSignal
): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.name) params.set('name', filters.name);
  if (filters.status) params.set('status', filters.status);
  if (filters.species) params.set('species', filters.species);

  const res = await fetchWithRetry(`${BASE_URL}/character?${params}`, signal);
  if (!res.ok) {
    if (res.status === 404) return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
    if (res.status === 429) throw new RateLimitError();
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
  const res = await fetchWithRetry(url, signal);
  if (res.status === 429) throw new RateLimitError();
  if (!res.ok) throw new Error(`Failed to fetch characters by ids: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}
