// components/ui/spacer.tsx
import { cn } from "@/lib/utils";

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

const sizeMap = {
  xs: 'h-4',     // 16px
  sm: 'h-8',     // 32px
  md: 'h-12',    // 48px
  lg: 'h-16',    // 64px
  xl: 'h-20',    // 80px
  '2xl': 'h-24', // 96px
  '3xl': 'h-32', // 128px
  '4xl': 'h-40', // 160px
};

export function Spacer({ size = 'md', className }: SpacerProps) {
  return (
    <div 
      className={cn(
        sizeMap[size],
        'w-full',
        className
      )} 
      aria-hidden="true"
    />
  );
}