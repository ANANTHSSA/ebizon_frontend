import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import JSZip from "jszip"; // Import JSZip for working with ZIP files
import "../styles/FileUpload.scss"; // Import your CSS file for styling

// Set worker path for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileUpload = () => {
  const { handleSubmit, control, setValue } = useForm();
  const [file, setFile] = useState(null);
  const [zipContent, setZipContent] = useState(null);

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.name.endsWith(".zip")) {
      // If it's a ZIP file, extract and set the content
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(selectedFile);
      setZipContent(zipContent);
    } else {
      // Reset zipContent for non-ZIP files
      setZipContent(null);
    }

    setValue("filePreview", ""); // Reset the filePreview field value
  };

  const onSubmit = (data) => {
    // Handle form submission, you can use 'data' and 'file' here
    console.log(data);
    console.log(file);
  };

  const onCancel = () => {
    setFile(null);
    setZipContent(null);
    setValue("filePreview", ""); // Reset the filePreview field value
  };

  const renderZipContent = () => {
    if (!zipContent) {
      return null;
    }

    const fileNames = Object.keys(zipContent.files);

    return (
      <ul>
        {fileNames.map((fileName) => (
          <li key={fileName}>{fileName}</li>
        ))}
      </ul>
    );
  };

  const renderFilePreview = () => {
    if (!file) {
      return null;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return (
          <Controller
            name="filePreview"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Document file={file}>
                <Page pageNumber={1} width={200} />
              </Document>
            )}
          />
        );
      case "png":
      case "jpg":
      case "jpeg":
        return (
          <div className="image-preview">
            <img src={URL.createObjectURL(file)} alt="Image Preview" />
          </div>
        );
      case "zip":
        return renderZipContent();
      default:
        return <p>Unsupported file type</p>;
    }
  };

  return (
    <div className="answer-section fileUpload">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="file-label">Select File:</label>
          <input type="file" onChange={onFileChange} />
        </div>

        {file && (
          <>
            <div className="file-review text-center mt-3 mb-3">
              <div className="review-box">{renderFilePreview()}</div>

              <div className="mt-4 text-end">
                <button className="btn" type="button" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default FileUpload;
