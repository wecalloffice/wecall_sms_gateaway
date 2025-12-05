import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

const alertConfig = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: AlertCircle,
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: Info,
  },
};

interface AlertBoxProps {
  type: AlertType;
  message: string | React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  dismissible?: boolean;
}

export function AlertBox({
  type,
  message,
  icon,
  onClose,
  className,
  dismissible = true,
}: AlertBoxProps) {
  const config = alertConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'mb-6 p-4 rounded-lg flex items-start gap-3 border',
        config.bg,
        config.border,
        className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icon || <IconComponent size={20} className={config.text} />}
      </div>
      <p className={cn('text-sm flex-1', config.text)}>{message}</p>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
