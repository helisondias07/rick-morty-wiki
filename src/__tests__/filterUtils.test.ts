import { describe, it, expect } from 'vitest';
import { CharacterFilters, EpisodeFilters, LocationFilters } from '../types';

function buildCharacterQuery(page: number, filters: CharacterFilters): string {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.name) params.set('name', filters.name);
  if (filters.status) params.set('status', filters.status);
  if (filters.species) params.set('species', filters.species);
  return params.toString();
}

function buildEpisodeQuery(page: number, filters: EpisodeFilters): string {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.name) params.set('name', filters.name);
  if (filters.episode) params.set('episode', filters.episode);
  return params.toString();
}

function buildLocationQuery(page: number, filters: LocationFilters): string {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.name) params.set('name', filters.name);
  if (filters.type) params.set('type', filters.type);
  if (filters.dimension) params.set('dimension', filters.dimension);
  return params.toString();
}

describe('filterUtils', () => {
  it('builds character query with only page when no filters', () => {
    const q = buildCharacterQuery(1, {});
    expect(q).toBe('page=1');
  });

  it('includes name and status in character query', () => {
    const q = buildCharacterQuery(2, { name: 'Rick', status: 'Alive' });
    expect(q).toContain('name=Rick');
    expect(q).toContain('status=Alive');
    expect(q).toContain('page=2');
  });

  it('does not include empty filter values', () => {
    const q = buildCharacterQuery(1, { name: undefined, status: undefined, species: undefined });
    expect(q).toBe('page=1');
  });

  it('builds episode query with episode code', () => {
    const q = buildEpisodeQuery(1, { episode: 'S01E01' });
    expect(q).toContain('episode=S01E01');
  });

  it('builds location query with type and dimension', () => {
    const q = buildLocationQuery(1, { type: 'Planet', dimension: 'C-137' });
    expect(q).toContain('type=Planet');
    expect(q).toContain('dimension=C-137');
  });

  it('encodes special characters properly', () => {
    const q = buildCharacterQuery(1, { name: 'Rick & Morty' });
    expect(q).toContain('name=Rick+%26+Morty');
  });
});
