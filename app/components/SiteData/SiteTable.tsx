"use client"

import { useSiteData } from '@/app/context/SiteDataContext'
import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

interface SiteData {
  site_id: string
  site_name: string
  mc_cluster: string
  province: string
  dati_ii: string
  scope_of_work: string
  scope_category: string
  ran_scope: string
  latitude: number | null
  longitude: number | null
  nano_cluster: string
  [key: string]: string | number | null
}

const columns: ColumnDef<SiteData>[] = [
  {
    accessorKey: 'site_id',
    header: 'Site ID',
  },
  {
    accessorKey: 'site_name',
    header: 'Site Name',
  },
  {
    accessorKey: 'mc_cluster',
    header: 'MC Cluster',
  },
  {
    accessorKey: 'province',
    header: 'Province',
  },
  {
    accessorKey: 'dati_ii',
    header: 'City',
  },
  {
    accessorKey: 'scope_category',
    header: 'Scope Category',
  },
  {
    accessorKey: 'scope_of_work',
    header: 'Scope of Work',
  },
  {
    accessorKey: 'ran_scope',
    header: 'RAN Scope',
    cell: ({ getValue }) => {
      const value = getValue<string>()
      return value || '*blank*'
    }
  },
  {
    accessorKey: 'nano_cluster',
    header: 'NC',
  },
  {
    accessorKey: 'latitude',
    header: 'Latitude',
  },
  {
    accessorKey: 'longitude',
    header: 'Longitude',
  },
]

export function SiteTable() {
  const { filteredData } = useSiteData()
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2">
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  )
} 