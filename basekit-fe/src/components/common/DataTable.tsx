"use client";

import React, { useState } from "react";
import {
  Loader2,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  Table as ReactTable,
  TableMeta,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

interface TableHeaderProps {
  className?: string;
  table: ReactTable<any>;
}
const DataTableHeader = ({ table, className }: TableHeaderProps) => (
  <TableHeader
    className={`sticky top-0 z-10 bg-background shadow ${className}`}
  >
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id} className="hover:bg-transparent">
        {headerGroup.headers.map((header) => (
          <TableHead
            key={header.id}
            style={{ width: `${header.getSize()}px` }}
            className="h-10 font-bold text-sm"
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
);

interface TableBodyProps {
  className?: string;
  table: ReactTable<any>;
  isLoading?: boolean;
  colSpan: number;
  onRowClick?: (row: any) => void;
}
const DataTableBody = ({
  table,
  isLoading,
  colSpan,
  onRowClick,
}: TableBodyProps) => (
  <TableBody>
    {table.getRowModel().rows?.length && !isLoading
      ? table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            onClick={() => onRowClick && onRowClick(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="last:py-0 text-sm h-10">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      : null}

    {isLoading && (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">
          <div className="flex flex-1 items-center justify-center gap-4">
            <Loader2 className="animate-spin" />
            Cargando...
          </div>
        </TableCell>
      </TableRow>
    )}
  </TableBody>
);

interface NoDataInfo {
  title?: string;
  description?: string;
  className?: string;
}
const NoInfoBanner = ({
  title = "Sin resultados.",
  description = "Parece que no hay datos para mostrar.",
  className = "",
}: NoDataInfo) => (
  <div
    className={`flex items-center justify-center h-[30vh] w-full ${className}`}
  >
    <div className="max-w-2/5">
      <h1 className="font-bold text-xl">{title}</h1>
      <p className="opacity-60">{description}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// CoreTable — shared rendering core, accepts a pre-built table instance
// ---------------------------------------------------------------------------

interface CoreTableProps {
  table: ReactTable<any>;
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  noInfoBanner?: React.ReactNode;
  className?: string;
  hideHeaders?: boolean;
}

function CoreTable({
  table,
  columns,
  isLoading = false,
  onRowClick,
  noInfoBanner,
  className = "",
  hideHeaders = false,
}: CoreTableProps) {
  const isEmpty = !table.getRowModel().rows?.length && !isLoading;

  return (
    <>
      <Table className={`border-b ${className}`}>
        {!hideHeaders && (
          <DataTableHeader table={table} className="shadow-none" />
        )}
        <DataTableBody
          table={table}
          isLoading={isLoading}
          colSpan={columns.length}
          onRowClick={onRowClick}
        />
      </Table>
      {isEmpty && noInfoBanner}
    </>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type IPagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

type CustomDataTableProps = {
  columns: ColumnDef<any>[];
  data: Array<any>;
  meta?: TableMeta<any>;
  pagination?: IPagination;
  isLoading?: boolean;
  header?: React.ReactNode;
  onRowClick?: (row: any) => void;
  noInfoBanner?: React.ReactNode;
  className?: string;
  hideHeaders?: boolean;
};

/** Full-featured table: scrollable, column visibility, optional header slot and pagination. */
export default function DataTable({
  columns = [],
  data,
  meta = {},
  pagination,
  isLoading = false,
  header,
  noInfoBanner,
  onRowClick,
  hideHeaders = false,
}: CustomDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
    meta,
  });

  return (
    <div className="flex flex-col h-full">
      {header}
      <div className="relative flex h-full mt-2">
        <ScrollArea className="absolute inset-0 rounded-md w-full">
          <CoreTable
            table={table}
            columns={columns}
            isLoading={isLoading}
            onRowClick={onRowClick}
            noInfoBanner={noInfoBanner ?? <NoInfoBanner />}
            className="table-fixed"
            hideHeaders={hideHeaders}
          />
        </ScrollArea>
      </div>
      {pagination && (
        <div className="py-2 flex border-t text-sm">
          <DataTablePagination pagination={pagination} table={table} />
        </div>
      )}
    </div>
  );
}

/** Lightweight table: no scroll area, no pagination, no column visibility. */
export function SimpleDataTable({
  columns = [],
  data,
  meta = {},
  isLoading = false,
  onRowClick,
  noInfoBanner,
  className = "",
  hideHeaders = false,
}: CustomDataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  });

  return (
    <CoreTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      onRowClick={onRowClick}
      noInfoBanner={noInfoBanner ?? <NoInfoBanner />}
      className={className}
      hideHeaders={hideHeaders}
    />
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function PaginationButtons({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const isFirst = Number(page) === 1;
  const isLast = Number(page) === totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Link
            to={"."}
            search={(params) => ({ ...params, page: 1 })}
            disabled={isFirst}
          >
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              disabled={isFirst}
              aria-label="Go to first page"
            >
              <ChevronsLeft size={16} aria-hidden="true" />
            </Button>
          </Link>
        </PaginationItem>
        <PaginationItem>
          <Link
            to={"."}
            search={(params) => ({ ...params, page: page - 1 })}
            disabled={!hasPrevPage}
          >
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              disabled={!hasPrevPage}
              aria-label="Go to previous page"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </Button>
          </Link>
        </PaginationItem>
        <PaginationItem>
          <Link
            to={"."}
            search={(params) => ({ ...params, page: page + 1 })}
            disabled={!hasNextPage}
          >
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              disabled={!hasNextPage}
              aria-label="Go to next page"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </Link>
        </PaginationItem>
        <PaginationItem>
          <Link
            to={"."}
            search={(params) => ({ ...params, page: totalPages })}
            disabled={isLast}
          >
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              disabled={isLast}
              aria-label="Go to last page"
            >
              <ChevronsRight size={16} aria-hidden="true" />
            </Button>
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

interface DataTablePaginationProps {
  table: ReactTable<any>;
  pagination: IPagination;
}
export function DataTablePagination({ pagination }: DataTablePaginationProps) {
  const { page, perPage, total, totalPages } = pagination;
  const from = 1 + perPage * (page - 1);
  const to = Math.min(page * perPage, total);

  return (
    <div className="w-full flex justify-between items-center">
      <p
        className="text-muted-foreground text-sm whitespace-nowrap ps-1"
        aria-live="polite"
      >
        <span className="text-foreground">{`${from} - ${to}`}</span> de{" "}
        <span className="text-foreground">{total}</span>
      </p>
      <div className="flex gap-8">
        <PaginationButtons page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
