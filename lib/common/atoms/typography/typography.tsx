'use client';

import { useTextContent } from "@/lib/hooks/useTextContent";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface TypographyProps {
  textKey: string;
  params?: Record<string, string | number>;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  className?: string;
  children?: ReactNode;
}

export function Typography({ 
  textKey, 
  params, 
  as: Component = 'span',
  className,
  children 
}: TypographyProps) {
  const { getText, isLoading } = useTextContent();
  
  if (isLoading) {
    // Return skeleton directly without wrapping in Component to avoid block-level stretching
    return <Skeleton variant="text" textElement={Component} className={className} />;
  }
  
  const text = getText(textKey, params);
  
  return (
    <Component className={className}>
      {text}
      {children}
    </Component>
  );
}
