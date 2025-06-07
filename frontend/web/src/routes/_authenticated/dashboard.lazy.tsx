import {createLazyFileRoute} from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container.tsx";
import QRCodeComp from "@/components/ui/qrcode.tsx";
import {useState} from "react";
import {fetchUploadToken, getReceipts} from "@/features/receipt/service/receipt-service.ts";
import {ReceiptProps} from "@/types";
import {toast} from "sonner";
import {Button} from "@/components/ui/button.tsx";
import { useQuery } from '@tanstack/react-query';
import {dateFormater} from "@/lib/utils.ts";
import PDFViewer from "@/components/ui/pdf-viewer.tsx";
import GridLayout from "@/components/shared/grid-layout.tsx";

const Dashboard = () => {
    const [token, setToken] = useState<string>();

    const handleNewReceipt = async () => {
        try {
            const newToken = await fetchUploadToken();
            setToken(newToken);
        } catch (e) {
            if(e instanceof Error) {
                toast(`Could not generate token! ${e.message}`)
            }
        }
    }

    const { data, isLoading, isError, error } = useQuery<ReceiptProps[]>({
        queryKey: ['receipts'],
        queryFn: getReceipts,
        staleTime: 1000 * 60 * 30,
    });

  return (
      <LayoutContainer>
        <h3>Dashboard</h3>
          <Button onClick={handleNewReceipt}>new receipt</Button>
          {token && <QRCodeComp token={token}/>}
          <GridLayout gridCols={{ md:2, lg:2, xl: 2 }}>
          {data?.map((receipt) => {
              if(receipt.imageUri.endsWith(".pdf")) {
                  console.log(receipt.imageUri)
              }
              return (
                  <div key={receipt.id}>
                      <p>Receipt: {receipt.id}</p>
                      <p>createdAt: {dateFormater(receipt.createdAt)}</p>

                      <div className={"w-40 h-auto"}>
                          <PDFViewer pdfSrc={receipt.imageUri} />
                      </div>
                  </div>
              )
          })}
          {isLoading && <p>loading</p>}
          {isError}
          {error && <p>null</p>}
          </GridLayout>
      </LayoutContainer>
  )
}

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})