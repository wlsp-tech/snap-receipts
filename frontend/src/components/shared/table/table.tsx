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
import { Button } from "@/components/ui/button";
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
            <div className="overflow-x-auto sm:overflow-visible">
                <div className="min-w-[450px] w-fit mx-auto">
                    <table className="w-full">
                        <thead className="text-left [&_tr]:border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={cn(
                                            "p-4",
                                            header.id === "actions" && "w-28 text-right",
                                            header.id === "receiptImg" && "w-6/12",
                                            header.id === "createdAt" && "min-w-40"
                                        )}
                                    >
                                        {header.id === "createdAt" ? (
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
                                                }[
                                                    header.column.getIsSorted() as string
                                                    ] ?? null}
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
                                <tr key={row.id} className={"border-b transition-colors hover:bg-muted/50"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={cn(
                                                "p-4",
                                                cell.id.endsWith("_actions") && "text-right"
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

            <div className="w-full mt-6 flex flex-col gap-4 sm:flex-row sm:items-center px-2">
                <div className="sticky left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 w-fit">
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

                <div className="flex flex-col items-center sm:items-end self-end gap-1">
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
