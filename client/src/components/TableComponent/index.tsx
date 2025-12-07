'use client';

import { ArrowBigLeftDash, ArrowBigRightDash, ArrowBigRightDashIcon, ArrowDown, ArrowUp, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, CircleArrowLeftIcon, CircleArrowRightIcon } from 'lucide-react';
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

    const tableInstance = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            initialState: { pageSize },
        },
        useSortBy,
        usePagination
    ) as any;

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
    } = tableInstance;

    return (
        <div className="w-full rounded-md fade-in overflow-auto bg-[#3A3A45]">
            <table
                {...getTableProps()}
                className="w-full "
            >
                <thead className="bg-[#3A3A45] px-6 py-4  rounded-md text-[#9AA0B5]">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map((column: any) => {
                                const sortableColumn = column;
                                return (
                                    <th
                                        {...column.getHeaderProps(
                                            showSorting ? sortableColumn.getSortByToggleProps?.() : undefined
                                        )}
                                        className="px-6 py-4 sticky top-0 z-20"
                                        key={column.id}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.render('Header')}
                                            {showSorting && sortableColumn.isSorted && (
                                                <span className="text-white">
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
                    className="text-white"
                >
                    {page.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
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
                                    className="transition-colors duration-300 odd:bg-[#222229] even:bg-[#2B2B33] hover:bg-[#8fd84c] hover:text-[#3A3A45] cursor-pointer text-white"
                                    key={row.id}
                                >
                                    {row.cells.map((cell) => (
                                        <td
                                            {...cell.getCellProps()}
                                            className="px-6 py-4 whitespace-nowrap text-sm"
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
                <div className="bg-[#3A3A45] text-[#9AA0B5] flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            className='cursor-pointer'
                        >
                            {/* <ChevronFirstIcon/> */}
                            <ChevronsLeftIcon/>
                        </button>
                        <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className='cursor-pointer'
                        >
                            <CircleArrowLeftIcon/>
                        </button>
                        <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className='cursor-pointer'
                        >
                            <CircleArrowRightIcon/>
                        </button>
                        <button
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                            className='cursor-pointer'
                        >
                            {/* <ChevronLastIcon/> */}
                            <ChevronsRightIcon/>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm">
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
                            className='cursor-pointer'
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

