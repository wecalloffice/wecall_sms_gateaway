import { cn } from '@/lib/utils';

interface ListCardProps {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  maxItems?: number;
}

export function ListCard({
  title,
  items,
  renderItem,
  emptyMessage = 'No items found',
  className,
  maxItems,
}: ListCardProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 border border-gray-200 shadow-sm',
        className
      )}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {displayItems.length > 0 ? (
          displayItems.map((item, idx) => renderItem(item, idx))
        ) : (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
