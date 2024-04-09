import React, { useContext, useState } from 'react'
import { stateContext } from '../../utills/statecontact';
import { useNavigate, useParams } from 'react-router-dom';
import { UseFetch } from '../../utills/UseFetch';
import axios from 'axios';
import PdfPreview from './PdfPreview';
import PrimaryBtn from '../../common/PrimaryBtn';
import '../../styles/CloudArchitecture.scss'
import CloseToast from '../../common/CloseToast';
import Toast from '../../common/Toast';


const CloudArchitecture = (
) => {
  const {
    state: {
      user_Data: { role_id, user_id }, token,
      popupData,
    },
    dispatch,
  } = useContext(stateContext);

  console.log("user_id", user_id, role_id, token);

  const Navigate = useNavigate();
  const { solution_id } = useParams();
  console.log("solution_id", solution_id);

  const [version, setVersion] = useState<boolean | number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [downloadMessage, setDownloadMessage] = useState<boolean>(false);

  const { data: archSubDocVersion, setRefetch: solutionRefresh } = UseFetch(
    "answers/architecture/supportingdoc",
    "GET",
    dispatch
  );

  const handleVersionChange = (event: any) => {
    const selectedValue = event.target.value;
    setVersion(selectedValue);
    setPdfUrl("");
    setIsOpen(!isOpen);
  };

  const { data: archSubDoc, setRefetch: archRefresh } = UseFetch(
    `answers/architecture/supportingdoc?version_no=${version}`,
    "GET",
    dispatch
  );



  const { data: finalVersion, setRefetch: finalRefresh } = UseFetch(
    `solutions/status?solution_id=${solution_id}`,
    "GET",
    dispatch
  );


  const finalizeVersion = finalVersion?.map((item: any) => {
    return item?.version_no;
  });

  // const RefreshFun = ()=>{
  //   archRefresh(true);
  //   finalRefresh(true);
  //   solutionRefresh(true);
  // }

  const handleFileInputClick = () => {
    //    alert("hi");

    const popupData = {
      showPopup: true,
      user_id: user_id,
      type: "File_Upload",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };

  const handleVersionClick = () => {
    //    alert("hi");
    const popupData = {
      showPopup: true,
      sol_id: solution_id,
      version: finalVersion,
      type: "Final_Version",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };

  //////////////// version logic  ////////////////

  const buttonStyle = {
    cursor: role_id == 4 || role_id == 2 ? "not-allowed" : "pointer",
    opacity: role_id == 4 || role_id == 2 ? 0.5 : 1,
    color: role_id == 4 || role_id == 2 ? "black" : "white",
    // padding:"0.75rem 2.5rem"
  };

  

  const handleDownload = async (fileName1: string) => {
    console.log("fileName", fileName1);
    if (!fileName1) {
      console.error("File name is undefined");
      return;
    }

    try {
      console.log("token", token);

      const response = await axios.get(
        `answers/attachment?filename=${fileName1}&mode=cloud_architecture&version_no=${version}`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("response", response);
      if (response.status >= 200 && response.status < 300) {
        const contentType = response.headers['content-type'];
        const contentLength = response.headers['content-length']; // Get content length
        const fileSize = contentLength ? parseInt(contentLength, 10) : 0; // Parse content length
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log("URL", url);

        // Create an invisible link element
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName1);

        // Append the link to the body and programmatically click it
        document.body.appendChild(link);
        link.click();

        // Remove the link from the DOM after the download
        document.body.removeChild(link);
        console.log("File size:", fileSize); 
      } else {
        console.error("Error downloading file. Status:", response.status);
      
      }
    } catch (error) {
      console.error("Error", error);
      setDownloadMessage(true);
      setPdfMessage(false);
    }
  };


  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  console.log("pdfUrl", pdfUrl);
  const [pdfMessage, setPdfMessage] = useState<boolean>(false);

  const previewErrorMessage={
    statusCode: 300,
    status: "Failure",
    message: "This file is not available for preview",
  }

  const downloadErrorMessage={
    statusCode: 300,
    status: "Failure",
    message: "This file is not available for download",
  }
  
  const [pageNumber, setPageNumber] = useState<boolean | number>(1);
  const [previewShown, setPreviewShown] = useState(false);

  const handlePreview = async (architectureName: string) => {
    console.log("architectureName", architectureName);

    try {
      const response = await axios.get(
        `answers/attachment?filename=${architectureName}&mode=cloud_architecture&version_no=${version}`,
        { responseType: 'arraybuffer', headers: { Authorization: `Bearer ${token}` }, }
      );

      if (response.status >= 200 && response.status < 300) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        setPdfUrl(blobUrl);
        setPreviewShown(false);
      } else {
        console.warn('Error downloading file. Status:', response.status);
      }
    } catch (error) {
      setPdfUrl('');
      setPdfMessage(true)
      setDownloadMessage(false)
      console.warn('Error:', error);
    }
  };


  // const handleCancel = () => {
  //   setPdfUrl(null);
  // }

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div id="CloudArchitecture">
      <div className="container">
        <div className="row filter align-items-center flex-wrap mb-3 pe-4">
          <div className="col-lg-4 col-md-6 text-start fs-3 fw-bold"></div>
          <div className="col-lg-3 col-md-6">
            <h4 className="fs-4 fw-bold d-inline">Final Version</h4>
            {finalizeVersion.length > 0 ? (
              <>
                <span className="text-success text-center ms-2">({finalizeVersion})</span>
              </>
            ) : (
              <span style={{ color: "#000", marginTop: "10px" }}> (not finalized) </span>
            )}
          </div>
          <div className={`custom-dropdown  ${isOpen ? "open" : ""} col-lg-2 col-md-4`}>
            <div>
              {/* <p className="dropdown-label text-center">Select Solution </p> */}
              <div
                className="selected-option d-flex justify-content-between align-items-center"
                onClick={handleToggleDropdown}
              >
                {version ? version : "Select a  Version"}
                <img
                  src={require("../../assets/Icons/dropDown.png")}
                  width={24}
                  height={24}
                  alt="dropdown-icon"
                />
              </div>
              {isOpen && (
                <div className="options1 p-2">
                  {archSubDocVersion?.map((version: any, index: number) => (
                    <option key={index} onClick={handleVersionChange}>{version?.version_no}</option>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-2 col-md-4 text-end">
            <PrimaryBtn onClick={handleFileInputClick} title='Upload the file'>
              {/* <iconify-icon icon="ic:outline-upload"></iconify-icon> */}
              {/* <img
                src={require("../../assets/Icons/Style=Outlined (3).png")}
                width={24}
                height={24}
                style={{ marginRight: "10px", color: "var(--Colours-Primary-colour-Blue-500)" }}
                alt="upload"
              /> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.738 16.627a1.492 1.492 0 0 1-1.487-1.362a37.117 37.117 0 0 1-.107-4.845a35.68 35.68 0 0 1-.253-.018l-1.49-.108a1.26 1.26 0 0 1-.97-1.935c1.097-1.716 3.106-3.636 4.76-4.824a1.388 1.388 0 0 1 1.619 0c1.653 1.188 3.662 3.108 4.759 4.824a1.26 1.26 0 0 1-.97 1.935l-1.49.108l-.253.018c.07 1.616.034 3.234-.107 4.845a1.492 1.492 0 0 1-1.487 1.362zm-.056-6.865a35.624 35.624 0 0 0 .063 5.365h2.51c.156-1.784.177-3.577.064-5.365a.75.75 0 0 1 .711-.796c.324-.016.647-.036.97-.06l1.081-.078a14.556 14.556 0 0 0-3.55-3.646L12 4.801l-.531.381a14.555 14.555 0 0 0-3.55 3.646L9 8.907c.323.023.647.043.97.059a.75.75 0 0 1 .711.796" clip-rule="evenodd" /><path fill="currentColor" d="M5.75 17a.75.75 0 0 0-1.5 0v2c0 .966.784 1.75 1.75 1.75h12A1.75 1.75 0 0 0 19.75 19v-2a.75.75 0 0 0-1.5 0v2a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25z" /></svg>
              Upload
            </PrimaryBtn>
          </div>
          <div className="col-lg-1 col-md-4 text-end">
            <PrimaryBtn
              onClick={handleVersionClick}
              style={buttonStyle}
              disabled={role_id == 4 || role_id == 2 ? true : false}
              title=''
            >
              Submit
            </PrimaryBtn>
          </div>
        </div>
        <div className="col-12">
          <div className="border text-center">
            {/* <h5 className="maindochead">Preview</h5> */}
            {archSubDoc.map((item: any, index: number) => (
              console.log("item", item),
              <div key={index} className='mt-3' style={{ cursor: "pointer" }}>
                <PrimaryBtn
                  // href="#"
                  // className='fw-bold'
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreview(item?.architecture_name);
                  }}
                  title='Double click the preview button'
                >
                  Preview
                </PrimaryBtn>
              </div>
            ))}

            {pdfUrl && !previewShown ? (
              <PdfPreview
                blobUrl={pdfUrl}
                // pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                onCancel={setPdfUrl}
                onLoadSuccess={() => setPreviewShown(true)} // Corrected to setPreviewShown
              />
            ) : (
              <h1 className="text-center preview fw-bold text-light">Preview</h1>
            )}

            {/* <iframe id="pdfPreview" width="100%" height="500px" frameborder="0"></iframe> */}
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="">
              <h5 className="fs-6 fw-bold my-3">Main Document</h5>
              <ul style={{ listStyle: "none", padding: "0" }}>
                {archSubDoc?.map((item: any, index: number) => (
                  <li key={index} className="">
                    <a
                      href="#"
                      style={{
                        color: item?.architecture_name ? "green" : "black",
                        textDecoration: item?.architecture_name
                          ? "underline"
                          : "none",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(item?.architecture_name);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className='pe-1 me-1' viewBox="0 0 24 24" fill="none">
                        <path d="M13 5.5V11.5H14.17L12 13.67L9.83 11.5H11V5.5H13ZM15 3.5H9V9.5H5L12 16.5L19 9.5H15V3.5ZM19 18.5H5V20.5H19V18.5Z" fill="#0B6E4F" />
                      </svg>{item?.architecture_name || "Not Available"}
                    </a>
                  </li>
                ))}
              </ul>
              <h5 className=" fs-6 fw-bold my-3">Remarks</h5>
              <ul>
                {archSubDoc?.map((item: any, index: number) => (
                  <li key={index} className="">
                    {item?.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-6">
            <div className="">
              <h5 className="fs-6 fw-bold my-3">Supporting Documents</h5>
              <ul style={{ listStyle: "none", padding: "0" }}>
                {archSubDoc?.map((item: any, index: number) =>
                  item?.supporting_docs?.map(
                    (subDoc: any, subIndex: number) => (
                      (
                        <li key={subIndex} className="">
                          <a
                            href="#"
                            style={{
                              color: subDoc?.sd_name ? "green" : "black",
                              textDecoration: subDoc?.sd_name
                                ? "underline"
                                : "none",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(subDoc?.sd_name);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className='pe-1 me-1' viewBox="0 0 24 24" fill="none">
                              <path d="M13 5.5V11.5H14.17L12 13.67L9.83 11.5H11V5.5H13ZM15 3.5H9V9.5H5L12 16.5L19 9.5H15V3.5ZM19 18.5H5V20.5H19V18.5Z" fill="#0B6E4F" />
                            </svg>{subDoc?.sd_name || "Not Available"}
                          </a>
                        </li>
                      )
                    )
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {pdfMessage && <Toast messages={previewErrorMessage} onClose={() => setPdfMessage(false)} />}
      {downloadMessage && <Toast messages={downloadErrorMessage} onClose={() => setDownloadMessage(false)} />}

    </div>
  );
};

export default CloudArchitecture
