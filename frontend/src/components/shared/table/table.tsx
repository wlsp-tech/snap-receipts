import { TableGenProps } from "@/types";
import { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/common/button.tsx";
import {cn} from "@/lib/utils";
import {
    ArrowDown,
    ArrowUp, ChevronLeft,
    ChevronRight,
    ChevronsLeft, ChevronsRight,
} from "lucide-react";

const Table = <T,>({
   data,
   columns,
   isLoading = false,
}: TableGenProps<T>) => {
    return <TableGen data={data} columns={columns} isLoading={isLoading} />;
};

export default Table;

function TableGen<T>({ data, columns, isLoading }: Readonly<TableGenProps<T>>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    });

    return (
        <div className="w-full text-foreground">
            <div className="overflow-x-auto lg:overflow-visible">
                <div className="w-full min-w-xl">
                    <table className="w-full table-fixed">
                        <thead className="text-left [&_tr]:border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={cn(
                                            "sticky top-0 p-3 w-[14%] text-center",
                                            header.id === "receiptImg" && "text-left w-[30%]",
                                            header.id === "actions" && "text-right"
                                        )}
                                    >
                                        {header.id !== "actions" && header.column.id !== "receiptImg"  ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className={cn(
                                                    "p-0",
                                                    header.column.getCanSort() &&
                                                    "cursor-pointer select-none"
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: <ArrowUp />,
                                                    desc: <ArrowDown />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </Button>
                                        ) : (
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="text-sm">
                        {isLoading ? (
                            <tr className="h-2">
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-10 bg-muted-foreground animate-pulse h-full"
                                />
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className={"border-b transition-colors hover:bg-muted/50"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={cn(
                                                "p-3 text-center w-[14%]",
                                                cell.column.id === "receiptImg" && " text-left w-[30%]",
                                                cell.column.id === "actions" && "w-[6%] text-right"
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center px-2">
                <div className="flex gap-2 w-full justify-center">
                    <Button
                        variant="icon"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                       <ChevronLeft />
                    </Button>
                    <Button
                        variant="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="icon"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight />
                    </Button>
                </div>

                <div className="flex flex-col items-center sm:items-end justify-center lg:self-end gap-1">
                    <p className="text-sm">
                        Page{' '}
                        <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
                        <strong>{table.getPageCount()}</strong>
                    </p>
                    <select
                        className="border rounded p-1 text-sm"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                shown {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

    );
}
