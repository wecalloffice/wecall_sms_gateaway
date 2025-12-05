"use client";

import React from "react";
import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface MetricBlockProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: number;
}

export default function MetricBlock({ icon: Icon, title, value, trend }: MetricBlockProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className="h-5 w-5 text-blue-600" />
      </div>

      <p className="text-2xl font-semibold">{value}</p>

      {trend !== undefined && (
        <p className={`${trend >= 0 ? "text-green-600" : "text-red-500"} text-sm`}>
          {trend >= 0 ? "+" : ""}
          {trend}%
        </p>
      )}
    </Card>
  );
}
