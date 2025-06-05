const PDFViewer = ({pdfSrc} : {pdfSrc: string}) => {
    return (
        <div>
            <iframe src={pdfSrc} />
        </div>
    )
}

export default PDFViewer;