import {QRCode} from "react-qrcode-logo";

const QRCodeComp = ({token}: { token?: string }) => {
    const url = `${import.meta.env.VITE_FRONTEND_ORIGIN}/document-upload/receipt/${token}`;
    return <QRCode
        value={url}
        size={150}
        eyeRadius={6}
        eyeColor="#625FFF"
        bgColor={"transparent"}
        logoPadding={200}
        logoPaddingStyle={"circle"}
    />
};
export default QRCodeComp;
