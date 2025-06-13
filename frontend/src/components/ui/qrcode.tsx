import {QRCodeSVG} from "qrcode.react";

const QRCodeComp = ({token}: { token?: string }) => {
    const url = `${import.meta.env.VITE_FRONTEND_ORIGIN}/document-upload/receipt/${token}`;
    return <QRCodeSVG value={url} size={150}/>
};
export default QRCodeComp;
