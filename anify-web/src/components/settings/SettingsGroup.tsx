import type { ReactNode } from 'react';

import { GlassCard } from '../ui/glass-card';

interface SettingsGroupProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsGroup({
  title,
  icon,
  description,
  children,
  className,
}: SettingsGroupProps) {
  return (
    <GlassCard className={className}>
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <span className="text-xl text-white/80">{icon}</span>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-white/50">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">{children}</div>
    </GlassCard>
  );
}
