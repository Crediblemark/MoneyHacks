import type { LucideIcon } from 'lucide-react';

interface AppPageHeaderProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  children?: React.ReactNode; // For actions like buttons
}

export function AppPageHeader({ title, icon: Icon, description, children }: AppPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-7 w-7 text-primary" />}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
        </div>
        {children && <div>{children}</div>}
      </div>
      {description && <p className="mt-1 text-muted-foreground">{description}</p>}
    </div>
  );
}
