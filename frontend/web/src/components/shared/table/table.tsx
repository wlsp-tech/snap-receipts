import {TableGenProps} from "@/types";
import {useState} from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable
} from "@tanstack/react-table";

const Table = <T,>({
                   data, columns
} : TableGenProps<T>) => {

    return (
        <TableGen {...{
            data,
            columns
        }} />
    )
}

export default Table;

function TableGen<T>({ data, columns }: TableGenProps<T>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })

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
        }
    })

    return (
        <div className="p2">
            <div className="h2 bg-red-500" />
            <table>
                <thead>
                {table.getHeaderGroups().map(hG => (
                    <tr key={hG.id}>
                        {hG.headers.map(header => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    <div {...{
                                        className: header.column.getCanSort()
                                            ? "cursor-pointer select-one"
                                            : "",
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                        {/*
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <Filter column={header.column} table={table} />
                                            </div>
                                        ) : null}
                                        */}
                                    </div>
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => {
                    return (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}
