'use client';

import { HeroUIProvider as HeroUIProviderBase } from '@heroui/react';
import type { ReactNode } from 'react';

interface HeroUIProviderProps {
  children: ReactNode;
}

export function HeroUIProvider({ children }: HeroUIProviderProps) {
  return <HeroUIProviderBase>{children}</HeroUIProviderBase>;
}