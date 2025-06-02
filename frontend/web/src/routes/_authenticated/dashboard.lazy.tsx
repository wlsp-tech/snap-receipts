import {createLazyFileRoute} from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container.tsx";
import QRCodeComp from "@/components/ui/qrcode.tsx";
import {useEffect, useState} from "react";
import {fetchUploadToken, getReceipts} from "@/features/receipt/service/receipt-service.ts";
import {ReceiptProps} from "@/types";
import {toast} from "sonner";
import {Button} from "@/components/ui/button.tsx";

const Dashboard = () => {
    const [receipts, setReceipts] = useState<ReceiptProps[] | []>([]);
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

    useEffect(() => {
        (async () => {
            try {
                const data = await getReceipts();
                setReceipts(data);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(`Could not fetch users. Error: ${error.message}`);
                }
            }
        })();
    }, [])

  return (
      <LayoutContainer>
        <h3>Dashboard</h3>
          <Button onClick={handleNewReceipt}>new receipt</Button>
          {token && <QRCodeComp token={token}/>}
          {receipts.map((receipt) => (
              <div key={receipt.id}>
                  <p>Receipt: {receipt.id}</p>
                  <p>createdAt: {receipt.createdAt}</p>

                  <div className={"w-80 h-auto"}>
                      <img src={`data:image/jpeg;base64,${receipt.imageUri}`} alt="Receipt" style={{ maxWidth: "100%", height: "auto" }} />
                  </div>
              </div>
          ))}
      </LayoutContainer>
  )
}

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})