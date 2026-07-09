import React from 'react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: Record<string, any>) => void;
}

export default function DataTable({ columns, data, onRowClick }: DataTableProps) {
  return (
    <div className="table-container overflow-x-auto">
      <table className="data-table w-full border-collapse">
        <thead>
          <tr className="bg-gray-800">
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-left text-gray-300">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className="hover:bg-gray-700 cursor-pointer transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="p-4 border-t border-gray-700">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}