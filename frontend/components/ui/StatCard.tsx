import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  change,
  trend = 'neutral',
  className,
}: StatCardProps) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-green-600',
  }[trend];

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn('text-xs mt-2', trendColor)}>
              {trend === 'up' && '+'}
              {change}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--primary-accent)' }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
