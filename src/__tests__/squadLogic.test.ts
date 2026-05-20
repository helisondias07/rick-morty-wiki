import { describe, it, expect } from 'vitest';
import { Character } from '../types';

const MAX_SQUAD = 5;

function addToSquad(squad: Character[], character: Character): Character[] {
  if (squad.length >= MAX_SQUAD) return squad;
  if (squad.find((c) => c.id === character.id)) return squad;
  return [...squad, character];
}

function removeFromSquad(squad: Character[], id: number): Character[] {
  return squad.filter((c) => c.id !== id);
}

function makeChar(id: number): Character {
  return {
    id,
    name: `Char ${id}`,
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    image: '',
    url: '',
    created: '',
    location: { name: 'Earth', url: '' },
    origin: { name: 'Earth', url: '' },
    episode: [],
  };
}

describe('squadLogic', () => {
  it('adds a character to squad', () => {
    const result = addToSquad([], makeChar(1));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('does not add duplicate characters', () => {
    const squad = [makeChar(1)];
    const result = addToSquad(squad, makeChar(1));
    expect(result).toHaveLength(1);
  });

  it('enforces a limit of 5 members', () => {
    let squad: Character[] = [];
    for (let i = 1; i <= 6; i++) {
      squad = addToSquad(squad, makeChar(i));
    }
    expect(squad).toHaveLength(5);
  });

  it('removes a character from squad', () => {
    const squad = [makeChar(1), makeChar(2), makeChar(3)];
    const result = removeFromSquad(squad, 2);
    expect(result).toHaveLength(2);
    expect(result.find((c) => c.id === 2)).toBeUndefined();
  });

  it('returns same array if id not found on remove', () => {
    const squad = [makeChar(1)];
    const result = removeFromSquad(squad, 99);
    expect(result).toHaveLength(1);
  });
});
