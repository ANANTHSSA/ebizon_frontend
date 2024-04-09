import React, { useContext, useEffect, useState } from 'react'
import PrimaryBtn from './PrimaryBtn';
import UseFetch from '../utills/UseFetch';
import { stateContext } from '../utills/statecontact';
import Toast from './Toast';
import '../styles/CaFileUpload.scss'
import { Navigate, useNavigate } from 'react-router-dom';
import CloseToast from './CloseToast';
import Loading from './Loading';

const CaFileUpload = ({ close, showToast,
  setShowToast }: { close: any, showToast: any, setShowToast: any }) => {

  // return (
  // <div>CaFileUpload</div>
  const {
    state: {
      user_Data: { role_id, user_id }, token,
      popupData,
    },
    dispatch,
  } = useContext(stateContext);


  // const [pdfErorr, setPdfErorr] = useState(false);
  // console.log(pdfErorr);
  // const [allFildesEmpty, setAllFildesEmpty] = useState(false);
  // const [fileSizeLimit, setFileSizeLimit] = useState(false);
  // const [messsageLength, setMesssageLength] = useState(false);
  // const [supportingDocSizeLimit, setSupportingDocSizeLimit] = useState(false);
  // const [doublicateFile, setDoublicateFile] = useState(false);
  // const [loading, setLoading] = useState(false);


  const [status, setStatus] = useState({
    pdfErorr: false,
    allFildesEmpty: false,
    fileSizeLimit: false,
    messageLength: false,
    supportingDocSizeLimit: false,
    doublicateFile: false,
    loading: false,
    architectureErrorMessage: false,
    messageEmptyError: false,
  });


  const messsageLengthCharacter = {
    statusCode: 300,
    status: "Failure",
    message: "Description must be less than 750 characters",
  }

  const selectPdfMessage = {
    statusCode: 300,
    status: "Failure",
    message: "Please select a valid PDF file",
  }

  const fileSizeLimitMessage = {
    statusCode: 300,
    status: "Failure",
    message: " PDF file exceed the size limit (100MB)",
  }



  const architecureErrorMessage = {
    statusCode: 300,
    status: "Failure",
    message: "please upload the Architecture document",
  }

  const supportingDocSizeLimitMessage = {
    statusCode: 300,
    status: "Failure",
    message: "Total file exceed the size limit (500MB)",
  }

  const doublicateFileMessage = {
    statusCode: 300,
    status: "Failure",
    message: "This file is already exists",
  }

  const messageEmptyError ={
    statusCode: 300,
    status: "Failure",
    message: "please provide a message",
  }

  const { data: preVerion } = UseFetch(
    "/answers/architecture/version",
    "GET",
    dispatch
  );


  const {
    apiCall: modelInsertFilesAndDecription,
    message: fileDecriptionMessage,
  } = UseFetch("/answers/supportingdoc", "POST", dispatch);


  const [architecureResponseData, setArchitecureResponseData] = useState("");


  ////////////////////////// CA Architect //////////////////////////
  const [architectureFiles, setArchitectureFiles] = useState<File[]>([]);


  const handleFileInputClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const selectedFiles = fileInput.files;

    if (selectedFiles && selectedFiles.length > 0) {
      // Check the first file in the selected files array
      const file = selectedFiles[0];

      if (file.type === "application/pdf") {
        // File is valid, update the state
        if (file.size <= 100 * 1024 * 1024) {
          // File is valid, update the state
          setArchitectureFiles([file]);
        }
        else {
          setStatus({
            ...status,
            fileSizeLimit: true,
          });
          setArchitectureFiles([]);
          fileInput.value = "";
        }

      } else {
        // Display an error message for invalid files
        console.error(
          "Please select a valid PDF file within the size limit (100MB)."
        );
        // alert("Please select a valid PDF file within the size limit (100MB).");
       setStatus({
         ...status,
         pdfErorr: true,
       })
        setArchitectureFiles([]);
        // Optionally, you can clear the file input or provide user feedback
        fileInput.value = ""; // Clear the file input value
      }
    } else {
      console.error("Please select at least one file.");
    }
  };

  ////////////// supporting document //////////////

  // const [suppotingDocFilesName, setSuppotingDocFilesName] = useState([]);
  // console.log(suppotingDocFilesName);



  // Function to check if adding a file will exceed the 500 MB limit
  // const isFileSizeWithinLimit = (fileSizeToAdd: number): boolean => {
  //   const maxSizeAllowed = 500 * 1024 * 1024; // 500 MB in bytes
  //   const totalSizeAfterAddition = totalFileSize + fileSizeToAdd;
  //   return totalSizeAfterAddition <= maxSizeAllowed;
  // };


  const handleSupportingDocFileInpuClick = () => {
    const fileInput = document.getElementById("fileSupport") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
    // document.getElementById("fileSupport").click();
  };




  // Initialize supportingDocFilesName state based on the initial value of files
  const [supportingDocFilesName, setSupportingDocFilesName] = useState<File[]>([]);


  // console.log(supportingDocFilesName);

  const totalFileSize = supportingDocFilesName.reduce((acc: any, fileInfo: any) => acc + fileInfo.size, 0);
  // console.log("totalFileSize", formatBytes(totalFileSize));

  const balance = 500 * 1024 * 1024 - totalFileSize;
  // console.log("balance", formatBytes(balance));

  const isBelow500MB = totalFileSize > 500 * 1024 * 1024;
  // console.log("isBelow500MB", isBelow500MB);




  const handleSupportingDocFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    // console.log("Selected files:", newFiles);

    if (newFiles) {
      const selectedFiles = Array.from(newFiles).map((file: any) => ({
        file,
        progress: 0,
        totalSize: file.size,
        uploadedSize: 0
      }));

      const selectedFilesSize = selectedFiles.reduce((acc: number, fileInfo: any) => acc + fileInfo.totalSize, 0);
      // console.log("selectedFilesSize", selectedFilesSize);

      const totalSizeAfterAddition = totalFileSize + selectedFilesSize;
      const balance = 500 * 1024 * 1024 - totalSizeAfterAddition;
      // console.log("balance", formatBytes(balance));

      if (isFileSizeWithinLimit(selectedFilesSize) && balance >= 0) {
        // console.log("Adding these files will not exceed the 500 MB limit and balance size is sufficient");

        // Filter out duplicate files
        const uniqueSelectedFiles = selectedFiles.filter((selectedFile: any) =>
          !supportingDocFilesName?.some((fileInfo: any) => fileInfo?.name === selectedFile?.file.name)
        );

        if (uniqueSelectedFiles.length === selectedFiles.length) {
          // No duplicate files found
          setSupportingDocFilesName((prevFiles: File[]) => [...prevFiles, ...uniqueSelectedFiles.map(file => file.file)]);
          // setTotalFileSize(totalSizeAfterAddition); // Update totalFileSize
          e.target.value = ""; // Clear the input field after adding files
        } else {
          // Display an error message or take appropriate action for duplicate files
          // console.log("Some files are duplicates and cannot be added.");
          setStatus({ ...status, doublicateFile: true });  // Assuming status is a state variable to show a toast message
          e.target.value = ""; // Clear the input field
        }
      } else {
        // Display an error message or take appropriate action
        // console.log("Adding these files will exceed the 500 MB limit or balance size is insufficient");
      
        setStatus({ ...status, supportingDocSizeLimit: true }); // Assuming atatus is a state variable to show a toast message
        e.target.value = ""; // Clear the input field
      }
    }
  };



// supporting document file size validation
  const isFileSizeWithinLimit = (totalSize: number) => {
    const maxFileSize = 500 * 1024 * 1024; // 500 MB in bytes
    return totalSize <= maxFileSize;
  };


    // supporting document file remove
  const handleSupportingDocFileRemove = (indexToRemove: number) => {

    setSupportingDocFilesName((prevFiles) => {
      // Create a new array without the item at the specified index
      return prevFiles.filter((_, index) => index !== indexToRemove);
    });
    const fileInput = document.getElementById("fileSupport") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  //////////////////////// message change ////////////////////

  const [message, setMessage] = useState<string>("");
  // console.log(message.length);


    // message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
  };

  //////////////////////////// last version submited ////////////////////////


  const handleSubmit = async (e: any) => {
    e.preventDefault();
     if(architectureFiles.length === 0){
      return setStatus({ ...status, architectureErrorMessage: true });
    }
    else if (message === "" || message === null) {
      return  setStatus({ ...status, messageEmptyError: true });
    }
    else if(message.length > 750){
      return  setStatus({ ...status, messageLength: true });
    }
    try {
      let uploadArchitectFile;
      let uploadSubDocFile;

      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const archFile = new FormData();
      // console.log(architectureFiles);
      const archiFileName = architectureFiles[0].name;
      // console.log(archiFileName);

      const supportFilesName = supportingDocFilesName.map(
        (file) => file.name
      );
      // console.log(supportFilesName);

      const nextVersion = preVerion
        ?.map((data: any) => data?.version_no + 1)
        .join(",");
      // console.log(nextVersion);

      uploadArchitectFile = {
        version_no: nextVersion,
        description: message,
        architecture_name: archiFileName,
        created_by: user_id,
        created_on: utcDate,
      };

      architectureFiles.forEach((file, index) => {
        archFile.append("file", file); // Use the field name expected by Multer
      });

      if (supportFilesName.length !== 0) {
        // console.log('enter the suport doc');
        supportingDocFilesName.forEach((file, index) => {
          archFile.append("file", file); // Use the field name expected by Multer
        });
      }

      // console.log(archFile);
      // archFile.append("file", architectureFiles);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/answers/architecture/upload?version_no=${nextVersion}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: archFile,
        }
      );
      // console.log(response);
      let archsuccess;
      if (response.ok) {
        const responseData = await response.json();
        // console.log(responseData);
        // console.log(uploadArchitectFile);
        archsuccess = await fetch(
          `${process.env.REACT_APP_BASE_URL}/answers/architecture`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(uploadArchitectFile),
          }
        );
        // console.log(archsuccess);
        // let  subDocSuccess;
        if (archsuccess.ok) {
          let archResponseData = await archsuccess.json();
          // console.log(archResponseData);
          setArchitecureResponseData(archResponseData);
          setShowToast(true);
          setStatus({ ...status, loading: true });
          // console.log(supportFilesName.length);
          if (supportFilesName.length !== 0) {
            // console.log("enter the sub doc added");
            uploadSubDocFile = {
              version_no: nextVersion,
              sd_name: supportFilesName,
              description: message,
              created_by: user_id,
              created_on: utcDate,
            };
            await modelInsertFilesAndDecription(uploadSubDocFile);
            setShowToast(true);
            setStatus({ ...status, loading: true });
          }
          // console.log(archResponseData?.version_no);
          // console.log(uploadSubDocFile);
        }
      } else {
        console.error(`Failed to upload. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }


  ////////////// file size converted //////////////

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
  }

  return (
    <>
      <div id='CaFileUpload'>
        <div className="uploadFile">
          <div className="container" style={{ opacity: status?.loading ? 0.5 : 1 }}>
            <>
              <div className="row">
                <div className="col-12">
                  <h2 className="fs-3 fw-bold">
                    Update / Replace{" "}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#171717" />
                    </svg>
                  </h2>
                </div>
                <div className="col-5">
                  <div className="border p-3 border-height">
                    <h2 className="fs-5 fw-bold mb-3">Architecture File  <span className='text-danger ms-2'>*</span></h2>
                    <PrimaryBtn style={{
                      backgroundColor: "var(--Colours-Primary-colour-Blue-500)",
                      color: "var(--Colours-Neutral-colours-White-10)",
                      border:
                        "1px solid var(--Colours-Primary-colour-Blue-500)",
                    }} onClick={handleFileInputClick}
                      disabled={status?.pdfErorr || status?.allFildesEmpty || status?.fileSizeLimit || status?.messageLength || showToast}
                      title=''
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.738 16.627a1.492 1.492 0 0 1-1.487-1.362a37.117 37.117 0 0 1-.107-4.845a35.68 35.68 0 0 1-.253-.018l-1.49-.108a1.26 1.26 0 0 1-.97-1.935c1.097-1.716 3.106-3.636 4.76-4.824a1.388 1.388 0 0 1 1.619 0c1.653 1.188 3.662 3.108 4.759 4.824a1.26 1.26 0 0 1-.97 1.935l-1.49.108l-.253.018c.07 1.616.034 3.234-.107 4.845a1.492 1.492 0 0 1-1.487 1.362zm-.056-6.865a35.624 35.624 0 0 0 .063 5.365h2.51c.156-1.784.177-3.577.064-5.365a.75.75 0 0 1 .711-.796c.324-.016.647-.036.97-.06l1.081-.078a14.556 14.556 0 0 0-3.55-3.646L12 4.801l-.531.381a14.555 14.555 0 0 0-3.55 3.646L9 8.907c.323.023.647.043.97.059a.75.75 0 0 1 .711.796" clip-rule="evenodd" /><path fill="currentColor" d="M5.75 17a.75.75 0 0 0-1.5 0v2c0 .966.784 1.75 1.75 1.75h12A1.75 1.75 0 0 0 19.75 19v-2a.75.75 0 0 0-1.5 0v2a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25z" /></svg>
                      Upload
                    </PrimaryBtn>
                    <input
                      type="file"
                      id="fileInput"
                      className=""
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />
                    <p style={{color:'#000'}}>
                      * Accepted format: PDF files at 100mb or less
                    </p>
                    <p className="">
                      <p className="">
                        {" "}
                        {architectureFiles.length > 0 && (
                          <div>
                            <p style={{ color: "var(--Colours-System-colours-Success-500" }} className='fs-6'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='pe-1 me-1' viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="#0B6E4F" />
                              </svg>
                              {architectureFiles[0].name}
                            </p>

                          </div>
                        )}
                      </p>
                    </p>
                  </div>
                </div>
                <div className="col-7">
                  <div className="border p-3 border-height">
                    <h2 className="fs-5 fw-bold mb-3">Supporting Document</h2>
                    <PrimaryBtn

                      onClick={handleSupportingDocFileInpuClick}
                      disabled={status?.pdfErorr || status?.allFildesEmpty || status?.fileSizeLimit || status?.messageLength || status?.loading}
                      title=''
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.738 16.627a1.492 1.492 0 0 1-1.487-1.362a37.117 37.117 0 0 1-.107-4.845a35.68 35.68 0 0 1-.253-.018l-1.49-.108a1.26 1.26 0 0 1-.97-1.935c1.097-1.716 3.106-3.636 4.76-4.824a1.388 1.388 0 0 1 1.619 0c1.653 1.188 3.662 3.108 4.759 4.824a1.26 1.26 0 0 1-.97 1.935l-1.49.108l-.253.018c.07 1.616.034 3.234-.107 4.845a1.492 1.492 0 0 1-1.487 1.362zm-.056-6.865a35.624 35.624 0 0 0 .063 5.365h2.51c.156-1.784.177-3.577.064-5.365a.75.75 0 0 1 .711-.796c.324-.016.647-.036.97-.06l1.081-.078a14.556 14.556 0 0 0-3.55-3.646L12 4.801l-.531.381a14.555 14.555 0 0 0-3.55 3.646L9 8.907c.323.023.647.043.97.059a.75.75 0 0 1 .711.796" clip-rule="evenodd" /><path fill="currentColor" d="M5.75 17a.75.75 0 0 0-1.5 0v2c0 .966.784 1.75 1.75 1.75h12A1.75 1.75 0 0 0 19.75 19v-2a.75.75 0 0 0-1.5 0v2a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25z" /></svg>
                      Upload
                    </PrimaryBtn>
                    <input
                      type="file"
                      id="fileSupport"
                      className=""
                      onChange={handleSupportingDocFileInputChange}
                      style={{ display: "none" }}
                      multiple // Add the "multiple" attribute to allow selecting multiple files
                      title=''
                    />
                    <p style={{color:'#000'}}>
                      * Accepted formats: .zip, .doc, .docx, .xls, .xlsx, .jpg, .png, .pdf etc ...
                      <p style={{color:'#000'}}>* max size 500MB  <span className={`ms-3 ${isBelow500MB ? 'text-danger' : 'text-primary'}`}>
                        Balance Size: {balance >= 0 ? formatBytes(balance) : '0'}.
                      </span></p>

                    </p>

                    {supportingDocFilesName.map((file, index) => (
                      // console.log(file),

                      <p className="fs-6 d-flex" style={{ color: "#0B6E4F" }} key={index}>
                        <span
                          className='col-1'
                        >
                          {file && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className='pe-1 me-1' viewBox="0 0 24 24" fill="none">
                              <path d="M13 5.5V11.5H14.17L12 13.67L9.83 11.5H11V5.5H13ZM15 3.5H9V9.5H5L12 16.5L19 9.5H15V3.5ZM19 18.5H5V20.5H19V18.5Z" fill="#0B6E4F" />
                            </svg>
                          )}
                        </span>
                        <span className="col-7">
                          {file.name}

                        </span>
                        <span className='ms-3 col-2 text-muted'>
                          ({formatBytes(file.size)})

                        </span>
                        <span className="ms-3 col-1" onClick={() =>
                          handleSupportingDocFileRemove(index)
                        } style={{ cursor: "pointer" }}>
                          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="red" />
                            </svg> */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="var(--Colours-Neutral-colours-Gray-400)" />
                          </svg>
                        </span>
                      </p>
                    ))}
                  </div>
                </div>

                {preVerion &&
                  preVerion?.map((item: any) => {
                    return (
                      <>
                        <div className="col-12">
                          <h5 className="fs-6 fw-bold my-3">{`Previous Version ${item.version_no}`}</h5>
                          {item?.description ? (
                            <ul className="ps-3">
                              <li>{item.description}</li>
                            </ul>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-12">
                          <h5 className="fs-6 fw-bold mb-3">{`Current Version ${item.version_no + 1
                            }`} <span className='text-danger ms-2'>*</span></h5>
                          <textarea
                            placeholder="message"
                            className="p-2"
                            cols={103}
                            rows={6}
                            onChange={handleMessageChange}
                          />
                        </div>
                      </>
                    );
                  })}
                {preVerion.length === 0 && (
                  <div className="col-12">
                    <h5 className="">
                      No Previous Version Available
                    </h5>
                    <h5 className="">{`Current Version ${""}`} <span className='text-danger ms-2'>*</span></h5>
                    <textarea
                      placeholder="message"
                      cols={103}
                      rows={10}
                      value={message}
                      onChange={handleMessageChange}
                    />
                  </div>
                )}
              </div>
              {/* <div className="row align-items-center justify-content-end"> */}
              <div className="text-end">
                <PrimaryBtn
                  onClick={() => close()}
                  style={{
                    background: "none",
                    color: "var(--Colours-Primary-colour-Blue-500)",
                    border: "1px solid var(--Colours-Primary-colour-Blue-500)",
                  }}
                  title=''
                >
                  Cancel
                </PrimaryBtn>
                <PrimaryBtn style={{ marginLeft: "1rem" }} disabled={status?.pdfErorr || status?.allFildesEmpty || status?.fileSizeLimit || status?.messageLength || status?.loading} onClick={handleSubmit} type="submit" title=''>
                  Submit
                </PrimaryBtn>
              </div>
            </>

          </div>
          {status?.pdfErorr && <CloseToast messages={selectPdfMessage} onClose={() => setStatus({ ...status, pdfErorr: false })} />}
          {status?.architectureErrorMessage && <CloseToast messages={architecureErrorMessage}  onClose={() => setStatus({ ...status, architectureErrorMessage: false })} />}
          {status?.fileSizeLimit && <CloseToast messages={fileSizeLimitMessage} onClose={() => setStatus({ ...status,fileSizeLimit: false })} />}
          {status?.messageLength && <CloseToast messages={messsageLengthCharacter}  onClose={() => setStatus({ ...status, messageLength: false })} />}
          {status?.supportingDocSizeLimit && <CloseToast messages={supportingDocSizeLimitMessage}  onClose={() => setStatus({ ...status, supportingDocSizeLimit: false })} />}
          {status?.doublicateFile && <CloseToast messages={doublicateFileMessage} onClose={() => setStatus({ ...status, doublicateFile: false })} />}
          {status?.messageEmptyError && <CloseToast messages={messageEmptyError} onClose={() => setStatus({ ...status, messageEmptyError: false })} />}
          {showToast && <Toast messages={architecureResponseData || fileDecriptionMessage} onClose={() => close()} />}
        </div>

      </div>

    </>
  );
}

export default CaFileUpload
