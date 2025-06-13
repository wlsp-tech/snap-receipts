import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container";
import QRCodeComp from "@/components/ui/qrcode";
import {useMemo, useState} from "react";
import {deleteReceipt, fetchUploadToken, getReceipts} from "@/features/receipt/service/receipt-service";
import {ReceiptProps} from "@/types";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {useQuery} from '@tanstack/react-query';
import {dateFormater} from "@/lib/utils";
import {ColumnDef} from "@tanstack/react-table";
import Table from "@/components/shared/table/table";
import Image from "@/components/ui/image";
import DeleteCell from "@/components/shared/table/delete-cell";
import {queryClient} from "@/lib/queryClient";

const Dashboard = () => {
    const [token, setToken] = useState<string>();
    const navigate = useNavigate();
    const isMobile = window.matchMedia('(max-width: 1279px)').matches;

    const handleNewReceipt = async () => {
        try {
            const newToken = await fetchUploadToken();
            setToken(newToken);

            if (isMobile) {
                await navigate({
                    to: '/document-upload/receipt/$token',
                    params: {token: newToken},
                });
            }
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
            await queryClient.invalidateQueries({queryKey: ['receipts']});
        } catch (e) {
            if (e instanceof Error) toast.error("Could not delete Receipt! Try again.")
        }
    }

    const columns = useMemo<ColumnDef<ReceiptProps>[]>(
        () => [
            {
                id: "receiptImg",
                header: () => "Receipt",
                cell: ({row}) => {
                    const {id, imageUri} = row.original;
                    return (
                        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                            <div className="w-24">
                                <Image src={imageUri} alt={`Receipt-${id}`}/>
                            </div>
                            <span className="truncate" title={`Receipt id: ${id}`}>Receipt id: {id}</span>
                        </div>
                    )
                }
            },
            {
                accessorFn: row => row.createdAt,
                id: "createdAt",
                cell: ({row}) => {
                    const {createdAt} = row.original;
                    return (
                        <>
                            {dateFormater(createdAt)}
                        </>
                    )
                },
                header: () => <span>Created at</span>,
                footer: r => r.column.id,
            },
            {
                id: "actions",
                header: () => "Actions",
                cell: ({row}) =>
                    <DeleteCell
                        deleteCallback={() => handleDelete(row.original.id)}
                    />,
            },
        ], []);

    return (
        <LayoutContainer className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Receipt Manager</h3>
                <Button
                    onClick={handleNewReceipt}
                    disabled={token !== undefined}>
                    New Receipt
                </Button>
            </div>

            <div
                className="border rounded-xl p-6 flex flex-col items-center justify-center min-h-96 bg-muted text-muted-foreground">
                {!token && data && data.length <= 0 && (
                    <>
                        <div
                            className="w-20  h-20 lg:w-32 lg:h-32 mb-4"
                        >
                            <svg version="1.2" xmlns="http://www.w3.org/2000/svg"
                                 overflow="visible"
                                 preserveAspectRatio="none" viewBox={"0 0 32 32"} className="w-full h-auto">
                                <g transform="translate(0, 0)">
                                    <g transform="translate(0, 0.000010000000000065512) rotate(0)">
                                        <path
                                            style={{
                                                strokeWidth: 0,
                                                strokeLinecap: "butt",
                                                strokeLinejoin: "miter",
                                                fill: "#18181C"
                                            }}
                                            d="M0,18.01296v-4.13189c0,-0.24649 0.02476,-0.48649 0.08667,-0.72649l2.59381,-10.87783c0.31571,-1.33622 1.46095,-2.27676 2.77952,-2.27676h11.98476c1.31857,0 2.46381,0.94054 2.77952,2.27676l1.15637,4.84953c-0.44854,-0.08302 -0.90987,-0.1263 -1.38065,-0.1263c-0.04043,0 -0.08078,0.00032 -0.12107,0.00096l-1.04131,-4.36743c-0.16095,-0.66162 -0.73048,-1.13513 -1.39286,-1.13513h-11.98476c-0.66238,0 -1.2319,0.47351 -1.38667,1.13513l-2.24095,9.37297h4.16619c0.54476,0 1.04,0.32432 1.28143,0.83027l1.03381,2.17297h3.6993c-0.0087,0.16225 -0.01311,0.32572 -0.01311,0.49027c0,0.34331 0.01919,0.68189 0.05649,1.0146h-3.74268c-0.53857,0 -1.04,-0.31784 -1.28143,-0.83027l-1.03381,-2.17297h-4.52524v0.00649c-0.02476,0.11676 -0.04333,0.23351 -0.04333,0.36324v4.13189c0,0.83027 0.63762,1.50486 1.43,1.50486h10.08938c0.27159,0.53658 0.59586,1.03864 0.96544,1.49838h-11.05482c-1.57857,0 -2.86,-1.34919 -2.86,-3.00324zM7.8681,5.25405h7.16238c0.39,0 0.7119,0.3373 0.7119,0.75243c0,0.40865 -0.3219,0.74595 -0.7119,0.74595h-7.16238c-0.39,0 -0.7119,-0.3373 -0.7119,-0.74595c0,-0.41513 0.3219,-0.75243 0.7119,-0.75243zM6.4381,9.00973h8.39758c-0.49094,0.44152 -0.93118,0.94475 -1.31007,1.49838h-7.0875c-0.39,0 -0.7119,-0.3373 -0.7119,-0.75243c0,-0.40865 0.3219,-0.74595 0.7119,-0.74595zM20.15953,21.90809c-1.63429,0 -3.20048,-0.68108 -4.3581,-1.88757c-1.15143,-1.21297 -1.80143,-2.85405 -1.80143,-4.56648c0,-1.71243 0.65,-3.35351 1.80143,-4.56648c1.15762,-1.20649 2.72381,-1.88757 4.3581,-1.88757c1.63429,0 3.20048,0.68108 4.3581,1.88757c1.15143,1.21297 1.80143,2.85405 1.80143,4.56648c0,1.71243 -0.65,3.35351 -1.80143,4.56648c-1.15762,1.20649 -2.72381,1.88757 -4.3581,1.88757zM17.86601,12.42485c-0.32762,0 -0.59743,0.27243 -0.59743,0.60324v3.99567c0,0.33081 0.26981,0.59676 0.59743,0.60324c0.33405,0 0.59743,-0.27243 0.59743,-0.60324v-2.53622l3.78373,3.82054c0.23126,0.23351 0.61028,0.23351 0.84797,0c0.23126,-0.24 0.23126,-0.6227 0,-0.85622l-3.7773,-3.82054h2.50535c0.32762,0 0.59743,-0.27243 0.59743,-0.60324c0,-0.33081 -0.26981,-0.60324 -0.59743,-0.60324z"
                                            vectorEffect="non-scaling-stroke"/>
                                    </g>
                                    <defs>
                                        <path id="path-1732809871245178"
                                              d="M0,18.01296v-4.13189c0,-0.24649 0.02476,-0.48649 0.08667,-0.72649l2.59381,-10.87783c0.31571,-1.33622 1.46095,-2.27676 2.77952,-2.27676h11.98476c1.31857,0 2.46381,0.94054 2.77952,2.27676l1.15637,4.84953c-0.44854,-0.08302 -0.90987,-0.1263 -1.38065,-0.1263c-0.04043,0 -0.08078,0.00032 -0.12107,0.00096l-1.04131,-4.36743c-0.16095,-0.66162 -0.73048,-1.13513 -1.39286,-1.13513h-11.98476c-0.66238,0 -1.2319,0.47351 -1.38667,1.13513l-2.24095,9.37297h4.16619c0.54476,0 1.04,0.32432 1.28143,0.83027l1.03381,2.17297h3.6993c-0.0087,0.16225 -0.01311,0.32572 -0.01311,0.49027c0,0.34331 0.01919,0.68189 0.05649,1.0146h-3.74268c-0.53857,0 -1.04,-0.31784 -1.28143,-0.83027l-1.03381,-2.17297h-4.52524v0.00649c-0.02476,0.11676 -0.04333,0.23351 -0.04333,0.36324v4.13189c0,0.83027 0.63762,1.50486 1.43,1.50486h10.08938c0.27159,0.53658 0.59586,1.03864 0.96544,1.49838h-11.05482c-1.57857,0 -2.86,-1.34919 -2.86,-3.00324zM7.8681,5.25405h7.16238c0.39,0 0.7119,0.3373 0.7119,0.75243c0,0.40865 -0.3219,0.74595 -0.7119,0.74595h-7.16238c-0.39,0 -0.7119,-0.3373 -0.7119,-0.74595c0,-0.41513 0.3219,-0.75243 0.7119,-0.75243zM6.4381,9.00973h8.39758c-0.49094,0.44152 -0.93118,0.94475 -1.31007,1.49838h-7.0875c-0.39,0 -0.7119,-0.3373 -0.7119,-0.75243c0,-0.40865 0.3219,-0.74595 0.7119,-0.74595zM20.15953,21.90809c-1.63429,0 -3.20048,-0.68108 -4.3581,-1.88757c-1.15143,-1.21297 -1.80143,-2.85405 -1.80143,-4.56648c0,-1.71243 0.65,-3.35351 1.80143,-4.56648c1.15762,-1.20649 2.72381,-1.88757 4.3581,-1.88757c1.63429,0 3.20048,0.68108 4.3581,1.88757c1.15143,1.21297 1.80143,2.85405 1.80143,4.56648c0,1.71243 -0.65,3.35351 -1.80143,4.56648c-1.15762,1.20649 -2.72381,1.88757 -4.3581,1.88757zM17.86601,12.42485c-0.32762,0 -0.59743,0.27243 -0.59743,0.60324v3.99567c0,0.33081 0.26981,0.59676 0.59743,0.60324c0.33405,0 0.59743,-0.27243 0.59743,-0.60324v-2.53622l3.78373,3.82054c0.23126,0.23351 0.61028,0.23351 0.84797,0c0.23126,-0.24 0.23126,-0.6227 0,-0.85622l-3.7773,-3.82054h2.50535c0.32762,0 0.59743,-0.27243 0.59743,-0.60324c0,-0.33081 -0.26981,-0.60324 -0.59743,-0.60324z"
                                              vectorEffect="non-scaling-stroke"/>
                                    </defs>
                                </g>
                            </svg>
                        </div>
                        <p className="text-center text-sm">You haven’t submitted any receipts yet.</p>
                    </>
                )}

                {token && !isMobile && (
                    <>
                        <QRCodeComp token={token}/>
                        {data && data.length <= 0 && <p className="mt-4 text-sm font-semibold">You are about to change that!</p>}
                    </>
                )}

                {!isError && data && data.length > 0 && (
                    <Table
                        data={data}
                        columns={columns}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </LayoutContainer>
    )
}

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
    component: Dashboard,
})