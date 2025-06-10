import {createLazyFileRoute} from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container.tsx";
import QRCodeComp from "@/components/ui/qrcode.tsx";
import {useMemo, useState} from "react";
import {deleteReceipt, fetchUploadToken, getReceipts} from "@/features/receipt/service/receipt-service.ts";
import {ReceiptProps} from "@/types";
import {toast} from "sonner";
import {Button} from "@/components/ui/button.tsx";
import {useQuery} from '@tanstack/react-query';
import {dateFormater} from "@/lib/utils.ts";
import {ColumnDef} from "@tanstack/react-table";
import Table from "@/components/shared/table/table.tsx";
import Image from "@/components/ui/image.tsx";
import DeleteCell from "@/components/shared/table/delete-cell.tsx";
import {queryClient} from "@/lib/queryClient.ts";

const Dashboard = () => {
    const [token, setToken] = useState<string>();

    const handleNewReceipt = async () => {
        try {
            const newToken = await fetchUploadToken();
            setToken(newToken);
        } catch (e) {
            if (e instanceof Error) {
                toast(`Could not generate token! ${e.message}`)
            }
        }
    }

    const {data, isLoading, isError} = useQuery<ReceiptProps[]>({
        queryKey: ['receipts'],
        queryFn: getReceipts,
        staleTime: 1000 * 60 * 30,
    });

    const handleDelete = async (id: string) => {
        try {
            await deleteReceipt(id);
            await queryClient.invalidateQueries({ queryKey: ['receipts'] });
        } catch (e) {
            if(e instanceof Error) toast.error("Could not delete Receipt! Try again.")
        }
    }

    const columns = useMemo<ColumnDef<ReceiptProps>[]>(
        () => [
            {
                id: "receiptImg",
                header: () => "Receipt",
                cell: ({ row }) => {
                    const { id, imageUri } = row.original;
                    return (
                        <div className={"p-2 w-40"}>
                            <Image src={imageUri} alt={`Receipt-${id}`} />
                            <span>Receipt id: {id}</span>
                        </div>
                    )
                }
            },
            {
                accessorFn: row => row.createdAt,
                id: "createdAt",
                cell: ({row}) => {
                    const { createdAt } = row.original;
                    return (
                        <>
                            {dateFormater(createdAt)}
                        </>
                    )
                },
                header: () => <span>Created at</span>,
                footer: r => r.column.id
            },
            {
                id: "actions",
                header: () => "Actions",
                cell: ({ row }) =>
                    <DeleteCell
                        deleteCallback={() => handleDelete(row.original.id)}
                    />,
            },
        ], []);

    return (
        <LayoutContainer>
            <h3>Dashboard</h3>
            <Button onClick={handleNewReceipt}>new receipt</Button>
            {token && <QRCodeComp token={token}/>}
            {!isLoading && !isError && data && data.length > 0 && (
                <Table data={data} columns={columns}/>
            )}

            {/*
            <GridLayout gridCols={{md: 2, lg: 2, xl: 2}}>
                {data?.map(({createdAt, id, imageUri}: ReceiptProps) => {
                    if (imageUri.endsWith(".pdf")) {
                        console.log(imageUri)
                    }
                    return (
                        <div key={id}>
                            <p>Receipt: {id}</p>
                            <p>createdAt: {dateFormater(createdAt)}</p>
                            <div className={"w-40 h-auto"}>
                                <Image src={imageUri} alt={id} />
                            </div>
                            <Button
                                variant="destructive"
                                onClick={async () => {
                                    await deleteReceipt(id);
                                    await queryClient.invalidateQueries({queryKey: ['receipts']});
                                }}>
                                delete
                                <Trash2Icon/>
                            </Button>
                        </div>
                    )
                })}
                {isLoading && <p>loading</p>}
                {isError}
                {error && <p>null</p>}
            </GridLayout>
            */}
        </LayoutContainer>
    )
}

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
    component: Dashboard,
})