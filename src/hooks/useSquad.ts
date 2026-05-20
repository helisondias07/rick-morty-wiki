import { useContext } from 'react';
import { SquadContext } from '../context/SquadContext';

export function useSquad() {
  const context = useContext(SquadContext);
  if (!context) {
    throw new Error('useSquad must be used within a SquadProvider');
  }
  return context;
}
