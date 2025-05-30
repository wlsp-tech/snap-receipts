import {QRCodeSVG} from 'qrcode.react';

const  QRCodeComp = ({ uuid } : {uuid: string}) => {
    const url = `http://192.168.178.116:8081/document-upload/receipt/${uuid}`;
    return (
        <div>
            <QRCodeSVG value={url} size={100} />
        </div>
    )
}

export  default QRCodeComp