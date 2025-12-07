"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
}) {
  return (
    <Card className="rounded-lg border bg-white dark:bg-slate-800 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                {change}
              </p>
            )}
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: "var(--primary-accent)" }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
