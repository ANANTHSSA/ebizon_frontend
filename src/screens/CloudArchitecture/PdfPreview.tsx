// import React, { useState, useEffect } from "react";
// import { pdfjs, Document, Page } from 'react-pdf'
// import PrimaryBtn from "../../common/PrimaryBtn";
// import '../../styles/PdfPreview.scss';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// interface PdfPreviewProps {
//   blobUrl: string;
//   // pageNumber: ;
//   setPageNumber: any;
//   onCancel: any
// }


// const PdfPreview: React.FC<PdfPreviewProps> = ({ blobUrl, setPageNumber, onCancel }) => {
//   const [numPages, setNumPages] = useState<number | null>(null);

//   useEffect(() => {
//     if (blobUrl) {
//       return () => {
//         URL.revokeObjectURL(blobUrl);
//       };
//     }
//   }, [blobUrl]);

//   const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//     setPageNumber(1); // Reset page number when a new PDF is loaded
//   };

//   const handleCancel = () => {
//     onCancel(''); // Call the provided onCancel function
//     // Additional logic to reset other related state if needed
//   };
//   return (
//     <div id="PdfPreview">
//       <Document file={blobUrl} onLoadSuccess={handleLoadSuccess} className="full-width-document">
//         {Array.from(new Array(numPages), (el, index) => (
//           <Page key={`page_${index + 1}`}  pageNumber={index + 1} />
//         ))}
//       </Document>
//       <div className="d-flex justify-content-between align-items-end">
//         <p className="d-inline px-3 lh-1" >Page 1 of {numPages}</p>
//         <PrimaryBtn style={{
//           background: "none",
//           color: "var(--Colours-Primary-colour-Blue-500)",
//           border: "1px solid var(--Colours-Primary-colour-Blue-500)",
//           margin: "0.5rem 0.5rem 0.5rem 0.5rem",
//         }} type="button" onClick={handleCancel}title=''>
//           Cancel
//         </PrimaryBtn>

//       </div>
//     </div>
//   );
// };

// export default PdfPreview;


import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PrimaryBtn from '../../common/PrimaryBtn'; // Import your PrimaryBtn component
import '../../styles/PdfPreview.scss'; // Import CSS file for styling

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfPreviewProps {
  blobUrl: string;
  setPageNumber: any;
  onCancel: any;
  onLoadSuccess: any;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ blobUrl, setPageNumber, onCancel,onLoadSuccess }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    if (blobUrl) {
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    }
  }, [blobUrl]);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset page number when a new PDF is loaded
  };

  const handleCancel = () => {
    onCancel(''); // Call the provided onCancel function
    // Additional logic to reset other related state if needed
  };

  return (
    <div id="PdfPreview" className="">
      <div className="pdf-preview-container">
      <Document file={blobUrl} onLoadSuccess={handleLoadSuccess} className="full-width-document">
        {Array.from(new Array(numPages || 0), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      <div className="d-flex justify-content-between align-items-end">
        <p className="d-inline px-3 lh-1">Page 1 of {numPages}</p>
        <PrimaryBtn
          style={{
            background: "none",
            color: "var(--Colours-Primary-colour-Blue-500)",
            border: "1px solid var(--Colours-Primary-colour-Blue-500)",
            margin: "0.5rem 0.5rem 0.5rem 0.5rem",
          }}
          type="button"
          onClick={handleCancel}
          title='Cancel'
        >
          Cancel
        </PrimaryBtn>
      </div>
      </div>
    </div>
  );
};

export default PdfPreview;
