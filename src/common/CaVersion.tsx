import React, { useContext, useState } from 'react'
import { stateContext } from '../utills/statecontact';
import UseFetch from '../utills/UseFetch';
import PrimaryBtn from './PrimaryBtn';
import Toast from './Toast';
import CloseToast from './CloseToast';


const CaVersion = ({ close, showToast,
  setShowToast }: { close: any, showToast: any, setShowToast: any }) => {
  const {
    state: {
      user_Data: { role_id, user_id }, token,
      popupData,
    },
    dispatch,
  } = useContext(stateContext);

  console.log(popupData, user_id, role_id);

  const [showToast1, setShowToast1] = useState(false);
  console.log(showToast1)





  const CloesMessage = {
    statusCode: 300,
    status: "Failure",
    message: "Please fill the description.",
  }


  const { data: archSubDocVersion } = UseFetch(
    "answers/architecture/supportingdoc",
    "GET",
    dispatch
  );

  console.log(archSubDocVersion);

    // //////////////insert final version  submit //////////////////
  const { apiCall: modelInsertFinalSubmit, message: finalSubmitInsertMessage } =
    UseFetch("/solutions/status", "POST", dispatch);
  console.log(finalSubmitInsertMessage);
    // //////////////update final version submit //////////////////
  const { apiCall: modelUpdateFinalSubmit, message: finalSubmitUpdateMessage } =
    UseFetch("/solutions/status", "PUT", dispatch);

  console.log(finalSubmitUpdateMessage);

  const fVersion = popupData?.version?.flatMap((data: any) => data);

  console.log(fVersion);

  const finalVersion = fVersion?.map((data: any) => data?.version_no).join(",");
  console.log(finalVersion);

  const finalDesc = fVersion?.map((data: any) => data?.comments).join(",");
  console.log(finalDesc);

  /////////////////////// version ////////////////////


  const [version, setVersion] = useState(0);
  console.log(version);
  const [isOpen, setIsOpen] = useState(false);

  const handleVersionChange = (event: any) => {
    const selectedValue = event.target.value;
    setVersion(selectedValue);
    setIsOpen(!isOpen);
  };


  //////////////////////////// last version submited ////////////////////////
  const [description, setDescription] = useState("");
  console.log(description);


  /////// description hanlder //////

  const handleDescriptionChange = (e: any) => {
    const newValue = e.target.value;
    setDescription(newValue);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!description) {
      setShowToast1(true);
      return;
    }
    try {
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      if (
        finalVersion == "" ||
        finalVersion == version ||
        finalDesc == "" ||
        finalDesc == description
      ) {
        console.log("hi welcome to insert version");
        const insertFinalSubmit = {
          solution_id: popupData?.sol_id,
          solution_ans_stat: "Finalised Version",
          comments: description,
          version_no: version,
          created_by: user_id,
          created_on: utcDate,
          approved_by: user_id,
          approved_on: utcDate,
        };
        console.log(insertFinalSubmit);
        await modelInsertFinalSubmit(insertFinalSubmit);
        setShowToast(true);
      } else {
        console.log("hi welcome to update version");
        const updateFinalSubmit = {
          comments: description,
          version_no: version,
          sol_stat_updated_by: user_id,
          sol_stat_updated_on: utcDate,
          approved_by: user_id,
          approved_on: utcDate,
        };
        console.log(updateFinalSubmit);
        await modelUpdateFinalSubmit(updateFinalSubmit, popupData?.sol_id);
        setShowToast(true);
      }
    }
    catch (error) {
      console.log(error);
    }
  }


    // dropdown open and close function
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  return (

    <div className="container">
      <form className="container" onSubmit={handleSubmit}>
        <div className="">
          <h1 className="fs-3 fw-bold py-2">
            Submit for Final Approval
          </h1>
          {/* <div>
            <select
              id="solutionDropdown"
              className="selected-option"
              onChange={handleVersionChange}
              value={version}
            >
              <option value="">Select Version</option>
              {archSubDocVersion?.map((version: any, index: number) => (
                <option key={index}>{version?.version_no}</option>
              ))}
            </select>
          </div> */}
          <div className={`custom-dropdown  ${isOpen ? "open" : ""}`}>
            <div>
              {/* <p className="dropdown-label text-center">Select Solution </p> */}
              <div
                className="selected-option d-flex justify-content-between align-items-center"
                onClick={handleToggleDropdown}
              >
                {version ? version : "Select an option"}
                <img
                  src={require("../assets/Icons/dropDown.png")}
                  width={24}
                  height={24}
                  alt="dropdown-icon"
                />
              </div>
              {isOpen && (
                <div className="options ps-3" style={{ height: "16rem" }}>
                  {archSubDocVersion?.map((version: any, index: number) => (
                    <option key={index} onClick={handleVersionChange}>{version?.version_no}</option>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className='fs-5 fw-bold py-2'> Description</label>
          </div>
          <textarea
            placeholder="Description"
            id="description"
            cols={65}
            rows={4}
            onChange={handleDescriptionChange}
            className="mb-2 p-2"
          />
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
            <PrimaryBtn style={{ marginLeft: "1rem" }} onClick={handleSubmit} type="submit" title=''>
              Submit
            </PrimaryBtn>
          </div>
        </div>
      </form>
      {showToast1 && <CloseToast messages={CloesMessage} onClose={() => setShowToast1(false)} />}
      {showToast && <Toast messages={finalSubmitInsertMessage || finalSubmitUpdateMessage} onClose={() => close()} />}
    </div>

  )
}

export default CaVersion
