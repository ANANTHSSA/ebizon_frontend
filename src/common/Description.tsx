import React, { useState, useEffect, Fragment } from "react";
import PrimaryBtn from "./PrimaryBtn";
import UseFetch from "../utills/UseFetch";
import {  useNavigate } from "react-router-dom";
import Toast from "./Toast";
import MyTextarea from "./MyTextarea";

const Description = ({
  close,
  version_solution_id,
  dispatch,
  user_id,
  showToast,
  setShowToast,
}: {
  close: any;
  version_solution_id: any;
  dispatch: any;
  user_id:any;
  showToast:any;
  setShowToast:any;
}) => {

  const [description, setDescription] = useState({
    description: "",
  });

  const [error, setError] = useState({
    desError: "",
  });
  const { data: version } = UseFetch(
    `answers/previousVersion?solution_id=${version_solution_id}`,
    "GET",
    dispatch
  );
  const { apiCall: modelVersionApiCall ,message: versionMessage} = UseFetch(
    "/answers/versioning",
    "POST",
    dispatch
  );


    const Navigate = useNavigate();

  const descriptionFun = () => {
    if (description.description.trim() !== "") {
      setError({ desError: "" });
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const createVersionpayload = {
        solution_id:version_solution_id,
        user_id: user_id,
        comments:"",
        description: description?.description,
        created_by: user_id,
        created_on: utcDate,
      };
      modelVersionApiCall(createVersionpayload);
      // close();
      setShowToast(true);
      Navigate("/Versions");
      sessionStorage.removeItem("Popup");
    } else {
      setError({ desError: "Description cannot be empty" });
    }
  };

  return (
    <div>
      <h3 className="mb-4">Version</h3>
      {version?.map((item: any, index: number) => (
        <Fragment key={index}>
          {item?.version_no == null ? (
            <>
              <h6>No previous version available</h6>
            </>
          ) : (
            <>
              <h6>Current Version : {item?.version_no + 1}</h6>
            </>
          )}
        </Fragment>
      ))}
      <label>Description</label>
      <MyTextarea
        className={`form-control ${error?.desError ? "has-error" : ""}`}
        value={description?.description}
        onBlur={(e) => {
          setDescription({
            ...description,
            description: e.target.value,
          });
        }}
      />
      <span className="invalid">
        {error?.desError && (
          <img
            src={require("../assets/Icons/info.png")}
            alt="info"
            style={{ marginRight: "0.5rem" }}
          />
        )}
        {error?.desError}
      </span>
      <div className="text-end mt-5">
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
        <PrimaryBtn
          style={{ marginLeft: "1rem" }}
          onClick={() => descriptionFun()}
          title=''
          disabled={showToast === true}
        >
          Submit
        </PrimaryBtn>
      </div>
     {showToast && <Toast messages={versionMessage} onClose={() => close()} />}
      
    </div>
  );
};

export default Description;
