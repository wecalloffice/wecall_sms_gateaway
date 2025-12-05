"use client";

import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  className?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  change,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border bg-white dark:bg-slate-800 shadow-sm transition-colors",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>

          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {value}
          </p>

          {change && (
            <p className="text-xs mt-2 font-medium text-green-600 dark:text-green-400">
              {change}
            </p>
          )}
        </div>

        {/* Icon container */}
        <div
          className={cn(
            "p-3 rounded-lg flex items-center justify-center",
            "bg-[var(--primary-accent)]"
          )}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent></CardContent>
    </Card>
  );
}
