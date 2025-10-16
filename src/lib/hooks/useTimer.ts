// src/lib/hooks/useTimer.ts
'use client';

import { useState, useEffect, useRef } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isClient]);

  const start = () => {
    if (isClient) setIsRunning(true);
  };

  const stop = () => {
    if (isClient) setIsRunning(false);
  };

  const reset = () => {
    if (isClient) {
      setIsRunning(false);
      setTime(0);
    }
  };

  return {
    time: isClient ? time : 0,
    isRunning: isClient ? isRunning : false,
    start,
    stop,
    reset
  };
};