'use client';

import { ArrowBigDownDashIcon, ArrowBigUpDashIcon, ArrowDown, ArrowUp, ChevronFirstIcon, ChevronLastIcon, ChevronLeft, ChevronLeftIcon, ChevronRight, ChevronRightIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import {
    useTable,
    useSortBy,
    usePagination,
    Column,
} from 'react-table';

interface DataTableProps<T extends object> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    showPagination?: boolean;
    showSorting?: boolean;
}

export default function DataTable<T extends object>({
    data,
    columns,
    pageSize = 10,
    showPagination = true,
    showSorting = true,
}: DataTableProps<T>) {
    const memoizedData = useMemo(() => data, [data]);
    const memoizedColumns = useMemo(() => columns, [columns]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize: currentPageSize },
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            initialState: { pageSize },
        },
        useSortBy,
        usePagination
    );

    return (

        <div className="w-full rounded-md fade-in overflow-auto fade-in">
            <table
                {...getTableProps()}
                className="w-full "
            >
                <thead className="bg-gray-200 px-6 py-4 border-1 border-gray-300 rounded-md text-gray-700 fade-in">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map((column: any) => {
                                const sortableColumn = column;
                                return (
                                    <th
                                        {...column.getHeaderProps(
                                            showSorting ? sortableColumn.getSortByToggleProps?.() : undefined
                                        )}
                                        className="px-6 py-4  sticky top-0 z-20"
                                        key={column.id}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.render('Header')}
                                            {showSorting && sortableColumn.isSorted && (
                                                <span className="text-gray-400">
                                                    {sortableColumn.isSortedDesc ? <ArrowDown /> : <ArrowUp />}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody
                    {...getTableBodyProps()}
                    className="text-gray-700"
                >
                    {page.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className=""
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className="transition-colors bg-white odd:bg-white even:bg-gray-50 hover:bg-gray-100 text-gray-700 fade-in"
                                    key={row.id}
                                >
                                    {row.cells.map((cell) => (
                                        <td
                                            {...cell.getCellProps()}
                                            className=" px-6 py-4 whitespace-nowrap text-sm "
                                            key={cell.column.id}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {showPagination && pageCount > 1 && (
                <div className="bg-gray-200 text-gray-600 flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            className=""
                        >
                            <ChevronFirstIcon/>
                        </button>
                        <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className=""
                        >
                            <ChevronLeftIcon/>
                        </button>
                        <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className=""
                        >
                            <ChevronRightIcon/>
                        </button>
                        <button
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                            className=""
                        >
                            <ChevronLastIcon/>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm ">
                            Page{' '}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>
                        </span>
                        <select
                            value={currentPageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}
                            className=""
                        >
                            {[10, 20, 30, 40, 50].map((size) => (
                                <option key={size} value={size}>
                                    Show {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}

