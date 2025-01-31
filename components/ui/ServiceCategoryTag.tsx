// service-pages/components/ui/ServiceCategoryTag.tsx
interface ServiceCategoryTagProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export function ServiceCategoryTag({ children, className = '' }: ServiceCategoryTagProps) {
    return (
      <span 
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ${className}`}
      >
        {children}
      </span>
    )
  }