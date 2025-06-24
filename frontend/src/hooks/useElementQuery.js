import { useEffect, useState } from 'react';

export function useElementQuery(ref, selector) {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    if (!ref.current) return;
    setNodes(Array.from(ref.current.querySelectorAll(selector)));
  }, [ref, selector]);
  return nodes;
} 