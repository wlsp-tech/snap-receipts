import {createLazyFileRoute} from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container.tsx";
import QRCodeComp from "@/components/ui/qrcode.tsx";
import {useState} from "react";
import {fetchUploadToken, getReceipts} from "@/features/receipt/service/receipt-service.ts";
import {ReceiptProps} from "@/types";
import {toast} from "sonner";
import {Button} from "@/components/ui/button.tsx";
import { useQuery } from '@tanstack/react-query';

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
          {data?.map((receipt) => (
              <div key={receipt.id}>
                  <p>Receipt: {receipt.id}</p>
                  <p>createdAt: {receipt.createdAt}</p>

                  <div className={"w-80 h-auto"}>
                      <img src={`data:image/jpeg;base64,${receipt.imageUri}`} alt="Receipt" style={{ maxWidth: "100%", height: "auto" }} />
                  </div>
              </div>
          ))}
          {isLoading && <p>loading</p>}
          {isError}
          {error && <p>null</p>}
      </LayoutContainer>
  )
}

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})