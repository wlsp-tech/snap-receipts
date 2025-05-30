import {createLazyFileRoute} from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container.tsx";
import QRCodeComp from "@/components/ui/qrcode.tsx";
import {useEffect, useState} from "react";
import {getReceipts} from "@/features/receipt/service/receipt-service.ts";
import {ReceiptProps} from "@/types";
import {toast} from "sonner";

const Dashboard = () => {
    const uuid = crypto.randomUUID();
    const [receipts, setReceipts] = useState<ReceiptProps[] | []>([]);

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
          <QRCodeComp uuid={uuid} />
          {receipts.map((receipt) => (
              <div key={receipt.id}>
                  <p>{receipt.uuid}</p>
              </div>
          ))}
      </LayoutContainer>
  )
}

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})