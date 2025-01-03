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

const columns = [
  {
    accessorKey: 'site_id',
    header: 'Site ID',
    size: 80,
  },
  {
    accessorKey: 'site_name',
    header: 'Site Name',
    size: 100,
  },
  {
    accessorKey: 'mc_cluster',
    header: 'MC',
    size: 80,
  },
  {
    accessorKey: 'province',
    header: 'Province',
    size: 80,
  },
  {
    accessorKey: 'dati_ii',
    header: 'City',
    size: 80,
  }
]

export function SiteTable() {
  const { filteredData } = useSiteData()
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <div className="w-full h-full flex flex-col gap-1">
      <h3 className="text-[10px] font-medium text-white/90">Site Details</h3>
      
      <div className="flex-1 min-h-0 bg-white/95 rounded-lg p-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <table className="w-full">
            <thead>
              <tr>
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    className="bg-gray-100/80 px-2 py-1 text-left text-[9px] font-medium text-gray-600"
                    style={{ width: header.getSize() }}
                  >
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[9px]">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-2 py-1 text-gray-600"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-auto pt-1 flex items-center justify-between text-[9px] text-gray-600">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-1 hover:text-black disabled:opacity-30"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-1 hover:text-black disabled:opacity-30"
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-1 hover:text-black disabled:opacity-30"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-1 hover:text-black disabled:opacity-30"
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 