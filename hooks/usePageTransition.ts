import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const usePageTransition = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const navigateWithTransition = (path: string, message?: string) => {
    setIsLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 500);
  };

  return {
    isLoading,
    navigateWithTransition,
    setIsLoading
  };
};