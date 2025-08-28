import { useEffect, useRef } from "react";

export function useTimeout(defaultDelay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const set = (callback: () => void, delay: number = defaultDelay) => {
    clear();
    timeoutRef.current = setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, delay);
  };

  useEffect(() => {
    return () => clear();
  }, []);

  return set;
}
