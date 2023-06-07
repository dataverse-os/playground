import { useEffect } from 'react';

export const useClickOutside = (
  refObject: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  const handleClickOutside = (e: MouseEvent) => {
    if (!refObject?.current?.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });
};
