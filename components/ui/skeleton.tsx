import { cn } from "@/lib/utils/cn"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'default';
  textElement?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
}

const getSkeletonSize = (textElement: string, className?: string): { height: string; width: string; preservedClasses: string } => {
  // Base sizes for different elements
  const baseSizes: Record<string, { height: string; width: string }> = {
    h1: { height: 'h-14', width: 'w-96' },
    h2: { height: 'h-10', width: 'w-80' },
    h3: { height: 'h-8', width: 'w-64' },
    h4: { height: 'h-7', width: 'w-56' },
    h5: { height: 'h-6', width: 'w-48' },
    h6: { height: 'h-5', width: 'w-40' },
    p: { height: 'h-5', width: 'w-48' },
    span: { height: 'h-4', width: 'w-24' },
    div: { height: 'h-4', width: 'w-32' },
    label: { height: 'h-4', width: 'w-32' },
  };

  let size = baseSizes[textElement] || baseSizes.span;
  let preservedClasses = '';

  // Adjust based on text size classes in className and preserve spacing
  if (className) {
    // Extract and preserve spacing, alignment, and layout classes
    const classArray = className.split(' ');
    const spacingClasses = classArray.filter(cls => 
      cls.match(/^(m[trblxy]?-|p[trblxy]?-|gap-|space-[xy]-|flex|inline|block|relative|absolute|mx-auto)/)
    );
    preservedClasses = spacingClasses.join(' ');

    if (className.includes('text-6xl')) {
      size = { height: 'h-20', width: 'w-full max-w-4xl' };
    } else if (className.includes('text-5xl')) {
      size = { height: 'h-16', width: 'w-full max-w-3xl' };
    } else if (className.includes('text-4xl')) {
      size = { height: 'h-14', width: 'w-full max-w-2xl' };
    } else if (className.includes('text-3xl')) {
      size = { height: 'h-12', width: 'w-full max-w-xl' };
    } else if (className.includes('text-2xl')) {
      size = { height: 'h-10', width: 'w-96' };
    } else if (className.includes('text-xl')) {
      size = { height: 'h-8', width: 'w-80' };
    } else if (className.includes('text-lg')) {
      size = { height: 'h-7', width: 'w-64' };
    } else if (className.includes('text-sm')) {
      size = { height: 'h-4', width: 'w-32' };
    } else if (className.includes('text-xs')) {
      size = { height: 'h-3', width: 'w-24' };
    }

    // Check for width utilities
    if (className.includes('w-full')) {
      size.width = 'w-full';
    } else if (className.includes('max-w-')) {
      const maxWidth = className.match(/max-w-(\S+)/)?.[0];
      if (maxWidth) {
        size.width = `w-full ${maxWidth}`;
      }
    }
  }

  return { ...size, preservedClasses };
};

function Skeleton({
  className,
  variant = 'default',
  textElement = 'span',
  ...props
}: SkeletonProps) {
  if (variant === 'text') {
    const { height, width, preservedClasses } = getSkeletonSize(textElement, className);
    return (
      <div
        className={cn("animate-pulse rounded-md bg-muted", height, width, preservedClasses)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
