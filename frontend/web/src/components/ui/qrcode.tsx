import {QRCodeSVG} from 'qrcode.react';

const  QRCodeComp = ({ token } : {token?: string}) => {
    const url = `http://192.168.178.116:8081/document-upload/receipt/${token}`;
    return (
        <div>
            <h1>{token}</h1>
            <QRCodeSVG value={url} size={300} />
        </div>
    )
}

export  default QRCodeComp