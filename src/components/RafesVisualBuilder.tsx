import React from 'react';
import { PageId } from '../types';

export default function RafesVisualBuilder({ activePage }: { activePage: PageId }) {
  return null;
}

// Global reusable custom react hook that allows Rafes Click-To-Edit capability on any element
export function useRafesEditor() {
  const rafesOpen = false;
  const editField = (
    elementId: string, 
    title: string, 
    currentValue: string, 
    isMultiline: boolean, 
    onSaveCallback: (newValue: string) => void
  ) => {
    // Disabled
  };

  return { rafesOpen, editField };
}

// Keep a backward compatible delegate just in case
export function useWixEditor() {
  return { wixOpen: false, editField: () => {} };
}
