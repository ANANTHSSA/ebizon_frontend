import React, { useContext, useState } from "react";
import { stateContext } from "../utills/statecontact";
import MyTextarea from "./MyTextarea";
import PrimaryBtn from "./PrimaryBtn";
import Toast from "./Toast";

const DeleteQuestion = ({ close, showToast, setShowToast }) => {
  const {
    state: {
      user_Data: { user_id, role_id },
      token,
      popupData,
    },
    dispatch,
  } = useContext(stateContext);

  console.log(popupData, "popupData");

  const [editUserInfo, setEditUserInfo] = useState({
    question_id: popupData ? popupData?.question_id : "",
    question: popupData ? popupData?.question : "",
  });

  const [deleteResponse, setDeleteResponse] = useState(null);
  console.log(deleteResponse, "deleteResponse");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const deleteUrl = `${process.env.REACT_APP_BASE_URL}/questions/excel/${popupData?.question_id}`;
      fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // You may need to include other headers like authorization if required
        },
      })
        .then((response) => {
          console.log("Response:", response);
          if (response.ok) {
            // Handle successful response
            return response.json();
          } else {
            console.error("Failed to delete data");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .then((jsonData) => {
          // Handle the parsed JSON data
          console.log("JSON Data:", jsonData);
          setDeleteResponse(jsonData);
          setShowToast(true);
          // Set or use the `jsonData` as needed
          // Example: setDeleteResponse(jsonData);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {popupData?.qlable === "Delete" && (
        <div>
          {popupData && (
            <>
            <p className="fs-5 text-primary">Delete Question</p>
              {/* {close()} */}
              <form className="container" onSubmit={handleSubmit}>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <img
                      src={require(`../../src/assets/subcatImage/signup.png`)}
                      alt="image"
                      width={"100%"}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="fs-6 text-primary" htmlFor="question">
                      Question : {editUserInfo.question_id}
                    </label>
                    <MyTextarea
                      type="text"
                      id="question"
                      name="question"
                      value={editUserInfo.question}
                      style={{
                        width: "100%",
                        cursor: "not-allowed",
                        backgroundColor:
                          "var(--Colours-Neutral-colours-Gray-100)",
                      }}
                      disabled={true}
                      // className="input"
                    />
                    <p className="fs-6">Are you sure you want to delete this question?</p>
                  </div>
                </div>
                <div className="text-end">
                  <PrimaryBtn
                    onClick={() => close()}
                    style={{
                      background: "none",
                      color: "var(--Colours-Primary-colour-Blue-500)",
                      border:
                        "1px solid var(--Colours-Primary-colour-Blue-500)",
                    }}
                    title=""
                  >
                    Cancel
                  </PrimaryBtn>
                  <PrimaryBtn
                    style={{ marginLeft: "1rem" }}
                    type="submit"
                    title=""
                  >
                    Submit
                  </PrimaryBtn>
                </div>
              </form>
            </>
          )}
        </div>
      )}
      {showToast && <Toast messages={deleteResponse} onClose={() => close()} />}
    </div>
  );
};

export default DeleteQuestion;
