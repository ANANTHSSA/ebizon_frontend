// import React, { useState } from 'react';

// const DragAndDrop = () => {
//   const [files, setFiles] = useState<any>([]);

//   const handleDrop = (e: any) => {
//     e.preventDefault();
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     setFiles((prevFiles: any) => [...prevFiles, ...droppedFiles]);
//   };

//   const handleFileInputChange = (e: any) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
//   };

//   const openFileDialog = () => {
//     const fileInput = document.getElementById("fileInput") as HTMLInputElement;
//     if (fileInput) {
//       fileInput.click();
//     }
//   };

//   return (
//     <div
//       className="drop-zone"
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//         <label htmlFor="fileInput">
//         <button onClick={openFileDialog} title="Choose Files">
//           Choose Files
//         </button>
//       </label>
//       <input
//         type="file"
//         id="fileInput"
//         multiple
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//       />

//       <ul>
//         {files.map((file: any, index: number) => (
//           <li key={index}>
//             <div>{file.name}</div>
//             <div>{`${(file.size / 1024).toFixed(2)} KB`}</div>
//             <div>
//               <progress value={0} max={100}></progress>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DragAndDrop;



///// file progress bar assign ////

// import React, { useState } from 'react';

// const DragAndDrop = () => {
//   const [files, setFiles] = useState<any>([]);
//   console.log("files", files);


//   const handleDrop = (e: any) => {
//     e.preventDefault();
//     const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
//       file,
//       progress: 0
//     }));
//     setFiles((prevFiles: any) => [...prevFiles, ...droppedFiles]);
//   };

//   const handleFileInputChange = (e: any) => {
//     const selectedFiles = Array.from(e.target.files).map((file:any) => {
//       return {
//         file,
//         progress: 0,
//         totalSize: file.size,
//         uploadedSize: 0
//       };
//     });

//     setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
//   };

//   const openFileDialog = () => {
//     document.getElementById('fileInput')?.click();
//   };

//   return (
//     <div
//       className="drop-zone"
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <input
//         type="file"
//         id="fileInput"
//         multiple
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//       />
//       <label htmlFor="fileInput">
//         <button onClick={openFileDialog} title="Choose Files">
//           Choose Files
//         </button>
//       </label>
//       <ul>
//         {files.map((fileInfo: any, index: number) => (
//           <li key={index}>
//             <div>{fileInfo.file.name}</div>
//             <div>{`${(fileInfo.file.size / 1024).toFixed(2)} KB`}</div>
//             <div>
//               <progress value={fileInfo.totalSize} max={100}> </progress>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DragAndDrop;








///////////////// this is multi select file added ////

// import React, { useState } from 'react';

// const DragAndDrop = () => {
//   const [files, setFiles] = useState<any>([]);

//   const handleFileInputChange = (e: any) => {
//     const selectedFiles = Array.from(e.target.files).map((file: any) => {
//         console.log("file", file);

//       return {
//         file,
//         progress: 0,
//         totalSize: file.size,
//         uploadedSize: 0
//       };
//     });

//     setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
//   };

//   const openFileDialog = () => {
//     document.getElementById('fileInput')?.click();
//   };

//   return (
//     <div
//       className="drop-zone"
//       onDrop={(e) => e.preventDefault()}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <input
//         type="file"
//         id="fileInput"
//         multiple
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//       />
//       <label htmlFor="fileInput">
//         <button onClick={openFileDialog} title="Choose Files">
//           Choose Files
//         </button>
//       </label>
//       <ul>
//         {files.map((fileInfo: any, index: number) => {
//           let fileSize;
//           if (fileInfo.file.size >= 1024 * 1024) {
//             fileSize = `${(fileInfo.file.size / (1024 * 1024)).toFixed(2)} MB`;
//           } else {
//             fileSize = `${(fileInfo.file.size / 1024).toFixed(2)} KB`;
//           }
//           return (
//             <li key={index}>
//               <div>{fileInfo.file.name}</div>
//               {/* <div>{`${(fileInfo.file.size / 1024).toFixed(2)} KB`}</div> */}
//               <div className="progress-bar">
//                 <progress
//                   value={fileInfo.progress}
//                   max={100}
//                   style={{
//                     width: '100%',
//                     height: '20px',
//                     borderRadius: '4px',
//                     backgroundColor: '#eee',
//                     color: fileInfo.progress < 100 ? 'orange' : 'green'
//                   }}
//                 >
//                 </progress>
//               </div>
//               <span className='me-4'>{fileSize}</span>
//               <span>{fileInfo.progress}%</span>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default DragAndDrop;




////////// single file drag and drop function ////////


// import React, { useState } from 'react';

// const DragAndDrop = () => {
//   const [files, setFiles] = useState<any>([]);

//   const handleFileInputChange = (e: any) => {
//     const selectedFiles = Array.from(e.target.files).map((file: any) => ({
//       file,
//       progress: 0,
//       totalSize: file.size,
//       uploadedSize: 0
//     }));

//     setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
//   };

//   const openFileDialog = () => {
//     document.getElementById('fileInput')?.click();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const droppedFiles = Array.from(e.dataTransfer.files).map((file: any) => ({
//       file,
//       progress: 0,
//       totalSize: file.size,
//       uploadedSize: 0
//     }));
//     console.log("droppedFiles", droppedFiles);

//     setFiles((prevFiles: any) => [...prevFiles, ...droppedFiles]);
//   };

//   return (
//     <div
//       className="drop-zone"
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <input
//         type="file"
//         id="fileInput"
//         multiple
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//       />
//       <label htmlFor="fileInput">
//         <button onClick={openFileDialog} title="Choose Files">
//           Choose Files
//         </button>
//       </label>
//       <ul>
//         {files.map((fileInfo: any, index: number) => {
//           let fileSize;
//           if (fileInfo.file.size >= 1024 * 1024) {
//             fileSize = `${(fileInfo.file.size / (1024 * 1024)).toFixed(2)} MB`;
//           } else {
//             fileSize = `${(fileInfo.file.size / 1024).toFixed(2)} KB`;
//           }
//           return (
//             <li key={index}>
//               <div>{fileInfo.file.name}</div>
//               <div className="progress-bar">
//                 <progress
//                   value={fileInfo.progress}
//                   max={100}
//                   style={{
//                     width: '100%',
//                     height: '20px',
//                     borderRadius: '4px',
//                     backgroundColor: '#eee',
//                     color: fileInfo.progress < 100 ? 'orange' : 'green'
//                   }}
//                 >
//                 </progress>
//               </div>
//               <span className='me-4'>{fileSize}</span>
//               <span>{fileInfo.progress}%</span>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default DragAndDrop;


//////////////////////////  this code is fine but douplicate file also accepted ////////////////

// import React, { useState } from 'react';

// const DragAndDrop = () => {
//   const [files, setFiles] = useState<any>([]);

//   const handleFileInputChange = (e: any) => {
//     const selectedFiles = Array.from(e.target.files).map((file: any) => ({
//       file,
//       progress: 0,
//       totalSize: file.size,
//       uploadedSize: 0
//     }));

//     setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
//   };

//   const openFileDialog = () => {
//     document.getElementById('fileInput')?.click();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const droppedFiles = e.dataTransfer.files;
//     if (droppedFiles.length > 0) {
//       const newFiles = Array.from(droppedFiles).map((file: any) => ({
//         file,
//         progress: 0,
//         totalSize: file.size,
//         uploadedSize: 0
//       }));
//       setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
//     }
//   };

//   return (
//     <div
//       className="drop-zone"
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <input
//         type="file"
//         id="fileInput"
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//       />
//       <label htmlFor="fileInput">
//         <button onClick={openFileDialog} title="Choose Files">
//           Choose Files
//         </button>
//       </label>
//       <ul>
//         {files.map((fileInfo: any, index: number) => {
//           let fileSize;
//           if (fileInfo.file.size >= 1024 * 1024) {
//             fileSize = `${(fileInfo.file.size / (1024 * 1024)).toFixed(2)} MB`;
//           } else {
//             fileSize = `${(fileInfo.file.size / 1024).toFixed(2)} KB`;
//           }
//           return (
//             <li key={index}>
//               <div>{fileInfo.file.name}</div>
//               <div className="progress-bar">
//                 <progress
//                   value={fileInfo.progress}
//                   max={100}
//                   style={{
//                     width: '100%',
//                     height: '20px',
//                     borderRadius: '4px',
//                     backgroundColor: '#eee',
//                     color: fileInfo.progress < 100 ? 'orange' : 'green'
//                   }}
//                 >
//                 </progress>
//               </div>
//               <span className='me-4'>{fileSize}</span>
//               <span>{fileInfo.progress}%</span>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default DragAndDrop;


/////////////////// this code is fiinalize then progress loading only not added file //////

// import React, { useEffect, useState } from 'react';

// const DragAndDrop = () => {
//   const [files, setFiles] = useState<any>([]);
//   console.log("files", files);


//   const handleFileInputChange = (e: any) => {
//     const selectedFiles = Array.from(e.target.files).map((file: any) => ({
//       file,
//       progress: 0,
//       totalSize: file.size,
//       uploadedSize: 0
//     }));

//     setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
//   };

//   const openFileDialog = () => {
//     document.getElementById('fileInput')?.click();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const droppedFiles = e.dataTransfer.files;
//     if (droppedFiles.length > 0) {
//       const newFiles = Array.from(droppedFiles).filter((file: any) => {
//         // Check if the dropped file already exists in the files array
//         return !files.some((existingFile: any) => existingFile.file.name === file.name);
//       }).map((file: any) => ({
//         file,
//         progress: 0,
//         totalSize: file.size,
//         uploadedSize: 0
//       }));
//       setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
//     }
//   };
//   const removeFile = (index: number) => {
//     setFiles((prevFiles: any) => prevFiles.filter((_: any, i: number) => i !== index));
//   };



//   useEffect(() => {
//     // Smoothly increase progress from 1% to 100% within a second
//     const interval = setInterval(() => {
//       setFiles((prevFiles:any) => {
//         return prevFiles.map((fileInfo:any) => {
//           if (fileInfo.progress < 100) {
//             const newProgress = Math.min(fileInfo.progress + 1, 100);
//             return { ...fileInfo, progress: newProgress };
//           }
//           return fileInfo;
//         });
//       });
//     }, 10); // Change this value to control the speed of progression

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div
//       className="drop-zone"
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <input
//         type="file"
//         id="fileInput"
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//         multiple
//       />
//       <label htmlFor="fileInput">
//         <button onClick={openFileDialog} title="Choose Files">
//           Choose Files
//         </button>
//       </label>
//       <ul>
//         {files.map((fileInfo: any, index: number) => {
//           let fileSize;
//           if (fileInfo.file.size >= 1024 * 1024) {
//             fileSize = `${(fileInfo.file.size / (1024 * 1024)).toFixed(2)} MB`;
//           } else {
//             fileSize = `${(fileInfo.file.size / 1024).toFixed(2)} KB`;
//           }
//           return (
//             <li key={index}>
//               <div className="d-flex align-items-center">
//                 <div className="col-5">
//                   <div>{fileInfo.file.name}</div>
//                   <div className="progress-bar">
//                     <progress
//                       value={fileInfo.progress}
//                       max={100}
//                       style={{
//                         width: '100%',
//                         height: '20px',
//                         borderRadius: '4px',
//                         backgroundColor: '#eee',
//                         color: fileInfo.progress < 100 ? 'orange' : 'green'
//                       }}
//                     >
//                     </progress>
//                   </div>
//                   <span className='me-4'>{fileSize}</span>
//                   <span>{fileInfo.progress}%</span>
//                 </div>
//                 <div className="col-1">
//                   <svg onClick={() => removeFile(index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="var(--Colours-Neutral-colours-Gray-400)" />
//                   </svg>
//                 </div>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default DragAndDrop;


///////////////////// progreess is not ok but small point of progress ok ////////////////

// import React, { useEffect, useState } from 'react';

// const DragAndDrop = () => {
//   const [files, setFiles] = useState<any>([]);
//   console.log("files", files);


//   const handleFileInputChange = (e: any) => {
//     const selectedFiles = Array.from(e.target.files).map((file: any) => ({
//       file,
//       progress: 0,
//       totalSize: file.size,
//       uploadedSize: 0
//     }));

//     setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
//   };

//   const openFileDialog = () => {
//     document.getElementById('fileInput')?.click();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const droppedFiles = e.dataTransfer.files;
//     if (droppedFiles.length > 0) {
//       const newFiles = Array.from(droppedFiles).filter((file: any) => {
//         // Check if the dropped file already exists in the files array
//         return !files.some((existingFile: any) => existingFile.file.name === file.name);
//       }).map((file: any) => ({
//         file,
//         progress: 0,
//         totalSize: file.size,
//         uploadedSize: 0
//       }));
//       setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
//     }
//   };
//   const removeFile = (index: number) => {
//     setFiles((prevFiles: any) => prevFiles.filter((_: any, i: number) => i !== index));
//   };



//   // useEffect(() => {
//   //   // Smoothly increase progress from 1% to 100% within a second
//   //   const interval = setInterval(() => {
//   //     setFiles((prevFiles: any) => {
//   //       return prevFiles.map((fileInfo: any) => {
//   //         if (fileInfo.progress < 100) {
//   //           const newProgress = Math.min(fileInfo.progress + 1, 100);
//   //           return { ...fileInfo, progress: newProgress };
//   //         }
//   //         return fileInfo;
//   //       });
//   //     });
//   //   }, 50); // Change this value to control the speed of progression

//   //   return () => clearInterval(interval);
//   // }, []);

//   useEffect(() => {
//     // Smoothly increase progress from 1% to 100% within a second
//     const totalSize = files.reduce((acc: number, fileInfo: any) => acc + fileInfo.totalSize, 0);
//     const interval = setInterval(() => {

//       setFiles((prevFiles: any) => {
//         const updatedFiles = prevFiles.map((fileInfo: any) => {
//           if (fileInfo.progress < 100) {
//             const newProgress = Math.min(fileInfo.progress + 1, 100);
//             return { ...fileInfo, progress: newProgress };
//           }
//           return fileInfo;
//         });

//         // Check if all files have reached 100% progress
//         const allCompleted = updatedFiles.every((fileInfo: any) => fileInfo.progress === 100);

//         // If all files are completed, clear the interval
//         if (allCompleted) {
//           clearInterval(interval);
//         }

//         return updatedFiles;
//       });
//     },totalSize > 0 ? 50 : 0 ); // Change this value to control the speed of progression

//     return () => clearInterval(interval);
//   }, [files]);


//   return (
//     <div
//       className="drop-zone"
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <input
//         type="file"
//         id="fileInput"
//         onChange={handleFileInputChange}
//         style={{ display: 'none' }}
//         multiple
//       />
//       <label htmlFor="fileInput">
//         <button onClick={openFileDialog} title="Choose Files">
//           Choose Files
//         </button>
//       </label>
//       <ul>
//         {files.map((fileInfo: any, index: number) => {
//           let fileSize;
//           if (fileInfo.file.size >= 1024 * 1024) {
//             fileSize = `${(fileInfo.file.size / (1024 * 1024)).toFixed(2)} MB`;
//           } else {
//             fileSize = `${(fileInfo.file.size / 1024).toFixed(2)} KB`;
//           }
//           const progressPercentage = (fileInfo.uploadedSize / fileInfo.totalSize) * 100;
//           let progressBarColor = '#fff'; // Default color

//           if (progressPercentage === 100) {
//             progressBarColor = 'green'; // Completed
//           } else if (progressPercentage > 0) {
//             progressBarColor = 'orange'; // In progress
//           }
//           return (
//             <li key={index}>
//               <div className="d-flex align-items-center">
//                 <div className="col-5">
//                   <div>{fileInfo.file.name}</div>
//                   <div className="progress-bar">
//                     <progress
//                       value={fileInfo.progress}
//                       max={100}
//                       style={{
//                         width: '100%',
//                         height: '20px',
//                         borderRadius: '4px',
//                         backgroundColor: '#fff',
//                         color: progressBarColor
//                       }}
//                     >
//                     </progress>
//                   </div>
//                   <span className='me-4'>{fileSize}</span>
//                   <span>{(( fileInfo.totalSize)).toFixed(2)}%</span>

//                 </div>
//                 <div className="col-1">
//                   <svg onClick={() => removeFile(index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="var(--Colours-Neutral-colours-Gray-400)" />
//                   </svg>
//                 </div>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };
// export default DragAndDrop;

import React, { useEffect, useState } from 'react';
import CloseToast from './CloseToast';

const DragAndDrop = () => {
  const [files, setFiles] = useState<any>([]);
  console.log("files", files);

  const [showToast, setShowToast] = useState(false);
  console.log("files", files?.map((file: any) => file?.file));

  const supportingDocument = files?.map((file: any) => file?.file)
  console.log(supportingDocument);


  const totalFileSize = files.reduce((acc: any, fileInfo: any) => acc + fileInfo.totalSize, 0);
  console.log("totalFileSize", formatBytes(totalFileSize));
  const [doublicateFile, setDoublicateFile] = useState(false);

  // Function to check if adding a file will exceed the 500 MB limit
  const isFileSizeWithinLimit = (fileSizeToAdd: number): boolean => {
    const maxSizeAllowed = 500 * 1024 * 1024; // 500 MB in bytes
    const totalSizeAfterAddition = totalFileSize + fileSizeToAdd;
    return totalSizeAfterAddition <= maxSizeAllowed;
  };

  const balance = 500 * 1024 * 1024 - totalFileSize;
  console.log("balance", formatBytes(balance));

  const isBelow500MB = totalFileSize > 500 * 1024 * 1024;
  console.log("isBelow500MB", isBelow500MB);


  const fileSizeMessage = {
    statusCode: 300,
    status: "Failure",
    message: " PDF file exceed the size limit (500MB).",
  }

  const doublicateFileMessage = {
    statusCode: 300,
    status: "Failure",
    message: "This file is already exists",
  }


  const handleFileInputChange = (e: any) => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;



    const selectedFiles = Array.from(e.target.files).map((file: any) => ({
      file,
      progress: 0,
      totalSize: file.size,
      uploadedSize: 0
    }));
    console.log("selectedFiles", selectedFiles);

    const selectedFilesSize = selectedFiles.reduce((acc: number, fileInfo: any) => acc + fileInfo.totalSize, 0);
    console.log("selectedFilesSize", selectedFilesSize);

    if (!isFileSizeWithinLimit(selectedFilesSize)) {
      console.log("Adding these files will exceed the 500 MB limit");
      setShowToast(true); // Show some kind of notification about exceeding limit
      fileInput.value = ""; // Clear the file input field
    }

    const uniqueSelectedFiles = selectedFiles.filter((selectedFile: any) =>
      !files.some((fileInfo: any) => fileInfo.file.name === selectedFile.file.name)
    );
    console.log("uniqueSelectedFiles", uniqueSelectedFiles);

    if (uniqueSelectedFiles.length === selectedFiles.length) {
      // No duplicate files found
      setFiles((prevFiles: File[]) => [...prevFiles, ...uniqueSelectedFiles.map(file => file)]);
      e.target.value = ""; // Clear the input field after adding files
    }
    else if (isFileSizeWithinLimit(selectedFilesSize)) {
      console.log("Adding these files will not exceed the 500 MB limit");
      // Proceed with adding files...
      setDoublicateFile(true);
    }

    else if (isFileSizeWithinLimit(selectedFilesSize)) {
      console.log("Adding these files will not exceed the 500 MB limit");

      setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
      fileInput.value = "";
    } else {
      // Display an error message or take appropriate action
      console.log("Adding these files will exceed the 500 MB limit");
      setShowToast(true);
      fileInput.value = "";
    }
  };

  const openFileDialog = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles).filter((file: any) => {
        // Check if the dropped file already exists in the files array
        return !files.some((existingFile: any) => existingFile.file.name === file.name);
      }).map((file: any) => ({
        file,
        progress: 0,
        totalSize: file.size,
        uploadedSize: 0
      }));
      const selectedFilesSize = newFiles.reduce((acc: number, fileInfo: any) => acc + fileInfo.totalSize, 0);
      console.log("selectedFilesSize", selectedFilesSize);

      if (isFileSizeWithinLimit(selectedFilesSize)) {
        console.log("Adding these files will not exceed the 500 MB limit");

        setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
        setDoublicateFile(true);
        fileInput.value = "";
      } else {
        // Display an error message or take appropriate action
        console.log("Adding these files will exceed the 500 MB limit");
        setShowToast(true);
        fileInput.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles: any) => prevFiles.filter((_: any, i: number) => i !== index));
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  useEffect(() => {
    let updatedFiles = files.map((fileInfo: any) => {
      if (fileInfo.progress < fileInfo.totalSize) {
        // Simulate progress based on uploaded size and total size
        const uploadedIncrement = Math.min(fileInfo.totalSize / 100, fileInfo.totalSize - fileInfo.progress);
        const newProgress = fileInfo.progress + uploadedIncrement;
        return { ...fileInfo, progress: newProgress };
      }
      return fileInfo;
    });

    // Check if all files are completed
    const allCompleted = updatedFiles.every((fileInfo: any) => fileInfo.progress === fileInfo.totalSize);

    if (files.length > 0 && !allCompleted) {
      const timeout = setTimeout(() => {
        setFiles((prevFiles: any) => {
          updatedFiles = prevFiles.map((fileInfo: any) => {
            if (fileInfo.progress < fileInfo.totalSize) {
              // Simulate progress based on uploaded size and total size
              const uploadedIncrement = Math.min(fileInfo.totalSize / 100, fileInfo.totalSize - fileInfo.progress);
              const newProgress = fileInfo.progress + uploadedIncrement;
              return { ...fileInfo, progress: newProgress };
            }
            return fileInfo;
          });

          return updatedFiles;
        });
      }, 50);

      // Clear the timeout only if all files are completed
      return () => {
        if (allCompleted) {
          clearTimeout(timeout);
        }
      };
    }
  }, [files]);




  // const formatBytes = (bytes: number) => {
  //   if (bytes >= 1024 * 1024) {
  //     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  //   } else if (bytes >= 1024) {
  //     return `${(bytes / 1024).toFixed(2)} KB`;
  //   } else {
  //     return `${bytes} bytes`;
  //   }
  // };
  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
  }

  console.log("totalFileSize", formatBytes(totalFileSize));

  return (
    <>
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          multiple
        />
        <label htmlFor="fileInput">
          <button onClick={openFileDialog} title="Choose Files">
            Choose Files
          </button>
        </label>
        <p className="">
          * Accepted formats: .zip, .doc, .docx, .xls, .xlsx, .jpg, .png, .pdf etc....
          * Max file size: 500 MB
          <span className={`ms-3 ${isBelow500MB ? 'text-danger' : 'text-primary'}`}>
            Balance Size: {balance >= 0 ? formatBytes(balance) : '0'}.
          </span>
        </p>

        <ul style={{ listStyle: 'none' }}>
          {files.map((fileInfo: any, index: number) => {
            // let fileSize;
            // if (fileInfo.totalSize >= 1024 * 1024) {
            //   fileSize = `${(fileInfo.totalSize / (1024 * 1024)).toFixed(2)} MB`;
            // } else if (fileInfo.totalSize >= 1024) {
            //   fileSize = `${(fileInfo.totalSize / 1024).toFixed(2)} KB`;
            // } else {
            //   fileSize = `${fileInfo.totalSize} bytes`;
            // }

            // let progressBarColor = 'orange'; // Default color
            // if (fileInfo.progress === fileInfo.totalSize) {
            //   progressBarColor = 'green'; // Completed
            // }



            return (
              <li key={index}>
                <div className="col-6" >
                  <div className="d-flex align-items-center">
                    <div className="col-1 text-end">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className='pe-1 me-1' viewBox="0 0 24 24" fill="none">
                        <path d="M13 5.5V11.5H14.17L12 13.67L9.83 11.5H11V5.5H13ZM15 3.5H9V9.5H5L12 16.5L19 9.5H15V3.5ZM19 18.5H5V20.5H19V18.5Z" fill="#0B6E4F" />
                      </svg>
                    </div>
                    <div className={`col-10 ${isBelow500MB ? 'text-danger' : ''}`}>
                      <div>{fileInfo.file.name}</div>
                      <div className="progress-bar">
                        <progress
                          value={fileInfo.progress}
                          max={fileInfo.totalSize}
                          style={{
                            width: '100%',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            // color: progressBarColor
                          }}
                        >
                        </progress>
                      </div>
                      {/* <span className='me-4'>{fileSize}</span> */}
                      <span> {formatBytes(fileInfo.totalSize)} / {formatBytes(fileInfo.progress)} </span>
                    </div>
                    <div className="col-1">
                      <svg onClick={() => removeFile(index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="var(--Colours-Neutral-colours-Gray-400)" />
                      </svg>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {showToast &&
        <CloseToast messages={fileSizeMessage} onClose={() => setShowToast(false)} />
      }
      {doublicateFile &&
        <CloseToast messages={doublicateFileMessage} onClose={() => setDoublicateFile(false)} />
      }
    </>
  );

};
export default DragAndDrop;

