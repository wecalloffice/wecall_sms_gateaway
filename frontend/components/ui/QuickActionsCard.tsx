import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface QuickAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface QuickActionsCardProps {
  title?: string;
  actions: QuickAction[];
  className?: string;
}

export function QuickActionsCard({
  title = 'Quick Actions',
  actions,
  className,
}: QuickActionsCardProps) {
  const router = useRouter();

  const handleClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      router.push(action.href);
    }
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    danger: 'bg-red-100 text-red-900 hover:bg-red-200',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 border border-gray-200 shadow-sm',
        className
      )}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-2">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(action)}
            className={cn(
              'w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2',
              variantClasses[action.variant || 'primary'],
              'hover:shadow-lg'
            )}
          >
            {action.icon && <span>{action.icon}</span>}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
