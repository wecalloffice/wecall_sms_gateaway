/**
 * Status color constants for consistent styling across the app
 */

export type StatusType = 
  | 'delivered' 
  | 'queued' 
  | 'pending' 
  | 'failed' 
  | 'sent' 
  | 'active' 
  | 'inactive'
  | 'processing'
  | 'completed'
  | 'cancelled';

export const STATUS_COLORS: Record<
  StatusType,
  {
    bg: string;
    text: string;
    border: string;
    light: string;
  }
> = {
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    light: 'bg-green-50',
  },
  queued: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    light: 'bg-yellow-50',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    light: 'bg-yellow-50',
  },
  failed: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    light: 'bg-red-50',
  },
  sent: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    light: 'bg-blue-50',
  },
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    light: 'bg-green-50',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    light: 'bg-gray-50',
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    light: 'bg-blue-50',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    light: 'bg-green-50',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    light: 'bg-red-50',
  },
};

export const getStatusColor = (status: string) => {
  return STATUS_COLORS[status as StatusType] || STATUS_COLORS.inactive;
};

export const STATUS_DISPLAY_NAMES: Record<StatusType, string> = {
  delivered: 'Delivered',
  queued: 'Queued',
  pending: 'Pending',
  failed: 'Failed',
  sent: 'Sent',
  active: 'Active',
  inactive: 'Inactive',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
