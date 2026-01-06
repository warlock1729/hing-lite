"use client";

import { Spinner } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  
} from "@heroui/table";
import { Key, ReactNode } from "react";

export type Column<T> = {
   key: keyof T | "actions";
  label: string;
  render?: (item: T) => ReactNode;
  width?: number;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyContent?: ReactNode;
  loadingContent?: ReactNode;
  isLoading?:boolean
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  emptyContent = "No data found",
  loadingContent=<Spinner />,
  isLoading=false
}: DataTableProps<T>) {
  return (
    <Table
      aria-label="Reusable data table"
      removeWrapper
      classNames={{
        base: "rounded-xl rounded-b-none border border-divider overflow-hidden",
        th: "bg-default-100 text-xs uppercase tracking-wider",
        td: "py-4",
        tr: "group hover:bg-default-100 transition-colors",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key as Key}
            width={column.width}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody
        items={data}
        emptyContent={emptyContent}
        loadingContent={loadingContent}
        isLoading={isLoading}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              const column = columns.find(c => c.key === columnKey);
              return (
                <TableCell>
                  {column?.render
                    ? column.render(item)
                    : (item)[columnKey]}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
