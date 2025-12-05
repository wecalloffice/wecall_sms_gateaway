import { cn } from '@/lib/utils';

type StatusType = 'delivered' | 'queued' | 'pending' | 'failed' | 'sent' | 'active' | 'inactive';

const statusMap: Record<
  StatusType,
  { bg: string; text: string; label: string }
> = {
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Delivered',
  },
  queued: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Queued',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pending',
  },
  failed: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Failed',
  },
  sent: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Sent',
  },
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Active',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'Inactive',
  },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StatusBadge({
  status,
  className,
  size = 'md',
  showLabel = true,
}: StatusBadgeProps) {
  const styles = statusMap[status] || statusMap.pending;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        styles.bg,
        styles.text,
        sizeClasses[size],
        className
      )}
    >
      {showLabel ? styles.label : status}
    </span>
  );
}
