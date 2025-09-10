"use client";

import { useState, useEffect } from "react";

export function useSpotlight() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open spotlight
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSpotlight = () => setIsOpen(true);
  const closeSpotlight = () => setIsOpen(false);

  return {
    isOpen,
    openSpotlight,
    closeSpotlight,
  };
}
