import { useState, useEffect, useRef } from 'react';

const useCounter = (end, duration = 1500, start = 0) => {
  const [count, setCount] = useState(start);
  const prevEnd = useRef(start);

  useEffect(() => {
    if (prevEnd.current === end) return;
    prevEnd.current = end;

    const startTime = Date.now();
    const startVal = count;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(startVal + (end - startVal) * eased);

      if (progress === 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

export default useCounter;