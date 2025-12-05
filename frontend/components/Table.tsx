"use client";

import React from "react";
import Image from "next/image";

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}

export default function Table({ columns, data, renderRow }: TableProps) {
  return (
    <div className="bg-white p-4 rounded-md overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th key={col.accessor} className={`pb-3 ${col.className}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => renderRow(item))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
