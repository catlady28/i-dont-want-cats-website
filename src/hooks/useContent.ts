import { useState, useEffect } from 'react';
import { ContentData, defaultContent } from '../data/content';
import { secureStorage } from '../utils/security';

const STORAGE_KEY = 'pawsAndHeartsContent';

export const useContent = () => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load content from secure storage on mount
    const savedContent = secureStorage.get(STORAGE_KEY);
    if (savedContent) {
      try {
        setContent({ ...defaultContent, ...savedContent });
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateContent = (updates: Partial<ContentData>) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    secureStorage.set(STORAGE_KEY, newContent);
  };

  const resetContent = () => {
    setContent(defaultContent);
    secureStorage.remove(STORAGE_KEY);
  };

  return {
    content,
    updateContent,
    resetContent,
    isLoading
  };
};