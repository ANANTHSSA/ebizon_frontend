import React, { useRef, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import '../styles/UploadBrn.scss';
const UploadBtn = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const selectedFiles = fileInput.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];

      if (file.size <= 500 * 1024 * 1024) {
        console.log([file]);
        setSelectedFileName(file.name);
      } else {
        console.error("Please select a file within the size limit (500MB).");
      }
    } else {
      console.error("Please select at least one file.");
      setSelectedFileName(null); // Reset the selected file name to null
    }

    // Reset the file input value to allow selecting the same file again
    fileInput.value = "";
  };

  const handleCancelClick = () => {
    setSelectedFileName(null); // Reset the selected file name to null
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  return (
    <div >
      <PrimaryBtn onClick={handleFileInputClick}  style={{
                            backgroundColor: "var(--Colours-Neutral-colours-White-10)",
                            color: "var(--Colours-Primary-colour-Blue-500)",
                            border:
                              "1px solid var(--Colours-Primary-colour-Blue-500)",
                          }}title=''>
        <img
          src={require("../assets/Icons/Style=Outlined (3).png")}
          width={24}
          height={24}
          style={{ marginRight: "10px", color: "var(--Colours-Primary-colour-Blue-500)" }}
          alt="upload"
        />
        Upload
      </PrimaryBtn>
      {selectedFileName && (
          <div className="d-flex align-items-center justify-content-between mt-2 upload-close-btn" >
          <p className="upload-file-name"><img
              src={require("../assets/Icons/check_circle.png")}
              width={20}
              height={20}
              style={{ marginRight: "10px" }}
            />{selectedFileName || ""}</p>
          <button type="button" onClick={handleCancelClick} className="cancel" style={{border:"none",background:"none"}}>
            <img
              src={require("../assets/Icons/close.png")}
              width={20}
              height={20}
              style={{ marginRight: "10px" }}
            />
          </button>
        </div>
      )}
      
      {/* <p>{selectedFileName || ''}</p>
      {selectedFileName && (
        <button type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      )} */}
      <input
        type="file"
        id="fileInput"
        className="ca-file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadBtn;

// import React, { useRef, useState } from 'react';
// import PrimaryBtn from './PrimaryBtn';

// const UploadBtn = () => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);

//   const handleFileInputClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const fileInput = e.target;
//     const selectedFiles = fileInput.files;

//     if (selectedFiles && selectedFiles.length > 0) {
//       const file = selectedFiles[0];

//       if (file.size <= 500 * 1024 * 1024) {
//         setIsLoading(true); // Set loading state to true
//         console.log([file]);

//         // Simulate file processing with a delay and update progress
//         for (let progress = 0; progress <= 100; progress += 10) {
//           setUploadProgress(progress);
//           await new Promise(resolve => setTimeout(resolve, 500));
//         }

//         setIsLoading(false); // Set loading state to false after processing
//         setUploadProgress(0); // Reset progress
//         setSelectedFileName(file.name);
//       } else {
//         console.error('Please select a file within the size limit (500MB).');
//         setIsLoading(false); // Set loading state to false
//       }
//     } else {
//       console.error('Please select at least one file.');
//       setIsLoading(false); // Set loading state to false
//       setSelectedFileName(null); // Reset the selected file name to null
//     }

//     // Reset the file input value to allow selecting the same file again
//     fileInput.value = '';
//   };

//   const handleCancelClick = () => {
//     setSelectedFileName(null); // Reset the selected file name to null
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''; // Clear the file input value
//     }
//     setUploadProgress(0); // Reset progress
//   };

//   return (
//     <div className="answer-section">
//       <PrimaryBtn onClick={handleFileInputClick} disabled={isLoading}>
//         {isLoading ? 'Uploading...' : 'Upload'}
//       </PrimaryBtn>
//       {uploadProgress > 0 && uploadProgress < 100 && (
//         <div className="progress-bar" style={{ width: `${uploadProgress}%`, height: '5px', backgroundColor: 'blue' }} />
//       )}
//       {selectedFileName && (
//         <>
//           <span>{selectedFileName}</span>
//           <button type="button" onClick={handleCancelClick} disabled={isLoading}>
//             Cancel
//           </button>
//         </>
//       )}
//       {isLoading && <div className="loading-spinner">Processing...</div>}
//       <input
//         type="file"
//         id="fileInput"
//         className="ca-file"
//         ref={fileInputRef}
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//       />
//     </div>
//   );
// };

// export default UploadBtn;
