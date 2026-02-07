import { cn } from "@/lib/utils/cn"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'default';
  textElement?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
}

const getSkeletonSize = (textElement: string, className?: string): { height: string; width: string; widthValue: string; preservedClasses: string; isBlockElement: boolean } => {
  // Determine if element is block-level
  const blockElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'];
  const isBlockElement = blockElements.includes(textElement);

  // Base sizes for different elements
  const baseSizes: Record<string, { height: string; width: string; widthValue: string }> = {
    h1: { height: 'h-14', width: 'w-96', widthValue: '24rem' },
    h2: { height: 'h-10', width: 'w-80', widthValue: '20rem' },
    h3: { height: 'h-8', width: 'w-64', widthValue: '16rem' },
    h4: { height: 'h-7', width: 'w-56', widthValue: '14rem' },
    h5: { height: 'h-6', width: 'w-48', widthValue: '12rem' },
    h6: { height: 'h-5', width: 'w-40', widthValue: '10rem' },
    p: { height: 'h-5', width: 'w-48', widthValue: '12rem' },
    span: { height: 'h-4', width: 'w-24', widthValue: '6rem' },
    div: { height: 'h-4', width: 'w-32', widthValue: '8rem' },
    label: { height: 'h-4', width: 'w-32', widthValue: '8rem' },
  };

  let size = baseSizes[textElement] || baseSizes.span;
  let preservedClasses = '';

  // Adjust based on text size classes in className and preserve spacing
  if (className) {
    // Extract and preserve spacing, alignment, and layout classes
    const classArray = className.split(' ');
    const spacingClasses = classArray.filter(cls => 
      cls.match(/^(m[trblxy]?-|p[trblxy]?-|gap-|space-[xy]-|flex|inline|block|relative|absolute|mx-auto|text-center|text-left|text-right|text-justify)/)
    );
    preservedClasses = spacingClasses.join(' ');

    if (className.includes('text-6xl')) {
      size = { height: 'h-20', width: 'w-full max-w-4xl', widthValue: 'min(100%, 56rem)' };
    } else if (className.includes('text-5xl')) {
      size = { height: 'h-16', width: 'w-full max-w-3xl', widthValue: 'min(100%, 48rem)' };
    } else if (className.includes('text-4xl')) {
      size = { height: 'h-14', width: 'w-full max-w-2xl', widthValue: 'min(100%, 42rem)' };
    } else if (className.includes('text-3xl')) {
      size = { height: 'h-12', width: 'w-full max-w-xl', widthValue: 'min(100%, 36rem)' };
    } else if (className.includes('text-2xl')) {
      size = { height: 'h-10', width: 'w-96', widthValue: '24rem' };
    } else if (className.includes('text-xl')) {
      size = { height: 'h-8', width: 'w-80', widthValue: '20rem' };
    } else if (className.includes('text-lg')) {
      size = { height: 'h-7', width: 'w-64', widthValue: '16rem' };
    } else if (className.includes('text-sm')) {
      size = { height: 'h-4', width: 'w-32', widthValue: '8rem' };
    } else if (className.includes('text-xs')) {
      size = { height: 'h-3', width: 'w-24', widthValue: '6rem' };
    }

    // Check for max-width utilities in className
    if (className.includes('max-w-')) {
      const maxWidthMatch = className.match(/max-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/);
      if (maxWidthMatch) {
        const maxWidthMap: Record<string, string> = {
          'xs': '20rem',
          'sm': '24rem',
          'md': '28rem',
          'lg': '32rem',
          'xl': '36rem',
          '2xl': '42rem',
          '3xl': '48rem',
          '4xl': '56rem',
          '5xl': '64rem',
          '6xl': '72rem',
          '7xl': '80rem',
        };
        size.widthValue = maxWidthMap[maxWidthMatch[1]] || size.widthValue;
      }
    }

    // Check for w-full without already having max-w handled
    if (className.includes('w-full') && !className.includes('max-w-')) {
      size.widthValue = '100%';
    }
  }

  return { ...size, preservedClasses, isBlockElement };
};

function Skeleton({
  className,
  variant = 'default',
  textElement = 'span',
  ...props
}: SkeletonProps) {
  if (variant === 'text') {
    const { height, width, widthValue, preservedClasses, isBlockElement } = getSkeletonSize(textElement, className);
    
    // Add mx-auto for centered text with max-width constraints
    const isCentered = className?.includes('text-center');
    const hasMaxWidth = width.includes('max-w-');
    const needsCentering = isCentered && hasMaxWidth && !preservedClasses.includes('mx-auto');
    
    const isFullWidth = width.includes('w-full');
    
    return (
      <div
        className={cn(
          "animate-pulse rounded-md bg-muted",
          isBlockElement ? "block" : "inline-block",
          height,
          preservedClasses,
          needsCentering && 'mx-auto'
        )}
        style={{
          width: isBlockElement ? 'auto' : widthValue,
          maxWidth: widthValue
        }}
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
