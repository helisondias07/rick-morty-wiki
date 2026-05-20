import { useCallback, useRef } from 'react';

export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isLoading: boolean
) {
  const observer = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (isLoading || !hasNextPage) return;

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { rootMargin: '200px' }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  return sentinelRef;
}

