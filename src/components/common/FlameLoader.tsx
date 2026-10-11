import React from 'react';
import { FlameIntro } from './FlameIntro';

interface FlameLoaderProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export const FlameLoader: React.FC<FlameLoaderProps> = ({ 
  onComplete
}) => {
  return (
    <FlameIntro 
      onComplete={onComplete}
      forcePlay={true}
    />
  );
};
