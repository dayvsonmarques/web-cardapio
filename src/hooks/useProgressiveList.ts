import { useEffect, useRef, useState } from "react";

/**
 * Revela uma lista em memória de forma incremental ("scroll infinito" client-side).
 *
 * Renderiza `batchSize` itens e carrega o próximo lote sempre que o elemento
 * apontado por `sentinelRef` entra na viewport. Ao trocar a referência de
 * `items` (ex.: mudança de busca/filtro), volta ao primeiro lote.
 */
const useProgressiveList = <T>(items: T[], batchSize = 8) => {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reinicia quando a lista de origem muda (nova busca/categoria).
  useEffect(() => {
    setVisibleCount(batchSize);
  }, [items, batchSize]);

  const hasMore = visibleCount < items.length;

  useEffect(() => {
    if (!hasMore) return;

    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => current + batchSize);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMore, batchSize]);

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore,
    sentinelRef,
  };
};

export default useProgressiveList;
