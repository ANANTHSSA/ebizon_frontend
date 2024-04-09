import React, { useContext, useEffect, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import MyTextarea from "./MyTextarea";
import { stateContext } from "../utills/statecontact";
import RadioBtn from "./RadioBtn";
import MultiSelect from "./MultiSelect";
import UseFetch from "../utills/UseFetch";
import Toast from "./Toast";

const EditQuestion = ({ close, showToast, setShowToast }) => {
  const {
    state: {
      user_Data: { user_id, role_id },
      token,
      popupData,
    },
    dispatch,
  } = useContext(stateContext);

  console.log(popupData, "popupData");

  const {
    apiCall: modelUpdateQuestionApiCall,
    message: updateQuestionMessage,
  } = UseFetch("/questions/singleQuestionUpdate", "POST", dispatch);
  console.log(updateQuestionMessage);

  const [confirmMessage, setConfirmMessage] = useState(false);

  const fewMinuts = () => {
    setConfirmMessage(true);
  };

  const toastmessage = {
    statusCode: 300,
    status: "Alert",
    message: "Few Minutes Wait",
  };

  const [editUserInfo, setEditUserInfo] = useState({
    question_id: popupData ? popupData?.question_id : "",
    question: popupData ? popupData?.question : "",
    question_type: popupData ? popupData?.question_type : "",
    answerlist: popupData ? popupData?.answerlist : "",
    follow_up: popupData ? popupData?.follow_up : "",
    mandatory: popupData ? popupData?.mandatory : "",
  });

  console.log(editUserInfo);

  const [selectedQuestionType, setSelectedQuestionType] = useState(
    editUserInfo?.question_type
  );
  // editUserInfo?.question_type
  console.log(selectedQuestionType);

  console.log(editUserInfo, "editUserInfo");
  console.log("fewpofjwofj");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/questions/singleQuestionInsert`;
      console.log("editUserInfo", editUserInfo);
      let resUpload;
      let QuesData;
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const editFollowPayload = {
        solution_id: popupData?.Qsol_id,
        cat_id: popupData?.Qcat_id,
        subCategory_id: popupData?.Qsubcat_id,
        question: editUserInfoFollowup?.question,
        question_type: editUserInfoFollowup?.question_type,
        mandatory: isMandaryCheckedFollowUp,
        created_by: user_id,
        created_on: utcDate,
        follow_up: null,
        order_id: 0,
      };
      console.log("editFollowPayload", editFollowPayload);
      const updateQuestionpayload = {
        question_id: editUserInfo.question_id,
        solution_id: popupData?.Qsol_id,
        cat_id: popupData?.Qcat_id,
        subCategory_id: popupData?.Qsubcat_id,
        question: editUserInfo.question,
        question_type: selectedQuestionType,
        mandatory: isMandaryChecked,
        created_by: user_id,
        created_on: utcDate,
        follow_up:
          selectedQuestionType == "Radio Button"
            ? JSON.stringify(editUserInfo?.follow_up)
            : null,
        possible_answers: editUserInfo?.answerlist
          ? editUserInfo?.answerlist
          : null,
      };
      console.log("updateQuestionpayload", updateQuestionpayload);
      // Check if any item in answerlist has isFollowUpChecked equal to true

      if (
        editUserInfo?.answerlist?.some(
          (item) => item.isFollowUpChecked === true
        )
      ) {
        let answerOptionsFollowUp = editUserInfo?.answerlist
          ?.filter((item) => item.isFollowUpChecked === true)
          ?.map((item) => item.answer);
        console.log("answerOptionsFollowUp", answerOptionsFollowUp);

        let answerOptionsFollowUpString = answerOptionsFollowUp?.join(", ");
        console.log("answerOptionsFollowUp", answerOptionsFollowUpString);

        console.log(
          popupData?.Qsol_id,
          popupData?.Qcat_id,
          popupData?.Qsubcat_id,
          editUserInfoFollowup?.question,
          editUserInfoFollowup?.question_type,
          isMandaryCheckedFollowUp
        );

        resUpload = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFollowPayload),
        });

        console.log("resUpload", resUpload);
        fewMinuts();
        if (resUpload.ok) {
          QuesData = await resUpload.json();
          console.log("QuesData", QuesData);

          updateQuestionpayload.follow_up = JSON.stringify([
            {
              id: QuesData?.question_id,
              action: "Render_child_control",
              criteria: answerOptionsFollowUpString,
            },
          ]);
          updateQuestionpayload.order_id = 0;
          console.log("editUserInfoFollowup", updateQuestionpayload);
          modelUpdateQuestionApiCall(
            updateQuestionpayload,
            editUserInfo.question_id
          );
          setShowToast(true);
        }
      } else {
        console.log("editUserInfoFollowup", updateQuestionpayload);
        await modelUpdateQuestionApiCall(updateQuestionpayload);
        setShowToast(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuestionTypeChange = (event) => {
    console.log("entetr handleQuestionTypeChange", event.target.value);
    setSelectedQuestionType(event.target.value);
    setOptions([""]);

    // Check if there are user-specific answerlist and the selected question type matches the user's question type
    const userAnswerlist = popupData?.answerlist || [];

    setEditUserInfo({
      ...editUserInfo,
      question_type: event.target.value,
      answerlist:
        event.target.value === popupData?.question_type ? userAnswerlist : [],
    });
  };

  const [options, setOptions] = useState([""]);
  console.log(options);

  const [isMandaryChecked, setIsMandaryChecked] = useState(
    editUserInfo?.mandatory == 1 ? true : false
  );
  // editUserInfo?.mandatory == 1 ? true : false
  console.log(isMandaryChecked);

  const handleMandaryChange = (e) => {
    console.log("entetr handleMandaryChange", e.target.checked);
    setIsMandaryChecked(e.target.checked);
  };

  const editQues = [
    {
      column: "col-lg-12",
      type: "text",
      placeholder: "Question",
      design: "input-box",
      value: editUserInfo.question,
      onChange: (e) => {
        setEditUserInfo({
          ...editUserInfo,
          question: e.target.value,
        });
      },
    },
    {
      column: "col-lg-6",
      type: "checkbox",
      placeholder: "mandatory",
    },
  ];

  const [editUserInfoFollowup, setEditUserInfoFollowup] = useState({
    question_id: popupData ? popupData?.question_id : "",
    question: "",
    question_type: "Free Text",
    answerlist: popupData ? popupData?.answerlist : "",
    follow_up: popupData ? popupData?.follow_up : "",
  });

  console.log(editUserInfoFollowup);

  const QuetionBtn = [
    {
      type_id: 1,
      question_type: "Free Text",
    },
    {
      type_id: 2,
      question_type: "Multi Select",
    },
    {
      type_id: 3,
      question_type: "Date",
    },
    {
      type_id: 4,
      question_type: "Radio Button",
    },
    {
      type_id: 5,
      question_type: "Dropdown",
    },
  ];

  const handleAnswerListChange = (index, value) => {
    console.log("entetr handleAnswerListChange", index, value);
    const updatedAnswerList = [...editUserInfo.answerlist];
    // console.log("updatedAnswerList", updatedAnswerList);
    // delete updatedAnswerList[index].possible_answer_id;
    // console.log("updatedAnswerList", updatedAnswerList);
    updatedAnswerList[index].answer = value;
    setEditUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      answerlist: updatedAnswerList,
    }));
    setOptions([""]);
  };

  const addAnswer = () => {
    const newAnswer = {
      answer: "",
      possible_answer_id: Date.now(), // You can use a more suitable unique identifier
    };

    setEditUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      answerlist: [...prevUserInfo.answerlist, newAnswer],
    }));
  };

  const removeAnswer = () => {
    if (editUserInfo.answerlist.length > 1) {
      const updatedAnswerList = [...editUserInfo.answerlist];
      updatedAnswerList.pop();
      setEditUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        answerlist: updatedAnswerList,
      }));
    }
  };

  ////////////////////////// follow up code ////////////////////////

  // const [selectedQuestionTypeFollowUp, setSelectedQuestionTypeFollowUp] =
  //   useState(editUserInfo?.question_type);
  // console.log(selectedQuestionTypeFollowUp);

  // const handleQuestionFollowUpChange = (event) => {
  //   console.log("entetr handleQuestionTypeChange", event.target.value);
  //   setSelectedQuestionTypeFollowUp(event.target.value);

  //   // Check if there are user-specific answerlist and the selected question type matches the user's question type
  //   const userAnswerlist = userData?.users?.answerlist || [];

  //   setEditUserInfoFollowup({
  //     ...editUserInfoFollowup,
  //     question_type: event.target.value,
  //     answerlist:
  //       event.target.value === userData?.users?.question_type
  //         ? userAnswerlist
  //         : [],
  //   });
  // };

  const handleFollowUpChange = (index) => {
    setEditUserInfo((prevUserInfo) => {
      const updatedAnswerList = [...prevUserInfo.answerlist];
      updatedAnswerList[index] = {
        ...updatedAnswerList[index],
        isFollowUpChecked: !updatedAnswerList[index].isFollowUpChecked,
      };
      return {
        ...prevUserInfo,
        answerlist: updatedAnswerList,
      };
    });
  };

  const [isMandaryCheckedFollowUp, setIsMandaryCheckedFollowUp] =
    useState(false);
  console.log(isMandaryCheckedFollowUp);

  const handleMandaryChangeFollowUp = (e) => {
    setIsMandaryCheckedFollowUp(e.target.checked);
    console.log("entetr handleMandaryChangeFollowUp", e.target.checked);
  };

  return (
    <>
      <div id="CreateUser">
        <form className="" onSubmit={handleSubmit}>
          <div className="row">
            <h3>{popupData ? "Edit Question" : ""}</h3>
            {/* <div className="col-lg-12"> */}
            {editQues?.map((item, index) => (
              <div className={item.column} key={index}>
                <div className="">
                  <p className="fs-5 text-primary">{item.placeholder}</p>
                  {item.type === "checkbox" ? (
                    <MultiSelect
                      type="checkbox"
                      checked={isMandaryChecked}
                      onChange={handleMandaryChange}
                    />
                  ) : (
                    <>
                      <MyTextarea
                        // type={item.type}
                        style={{ width: "100%" }}
                        value={item.value}
                        onChange={item.onChange}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
            <div className="col-lg-12">
              <div className="row">
                <p className="fs-5 text-primary fw-normal">Question Type</p>
                {QuetionBtn?.map((item, index) => (
                  <div key={item.type_id} className="col-lg-6">
                    <RadioBtn
                      // type="radio"
                      // id={`questionType_${item.type_id}`}
                      name="questionType"
                      value={item.question_type}
                      // className="btn_input"
                      onChange={handleQuestionTypeChange}
                      checked={selectedQuestionType === item.question_type}
                    />

                    <label htmlFor={`questionType_${item.type_id}`}>
                      {/* <p className="btn_text">{item.question_type}</p> */}
                    </label>
                  </div>
                ))}
                {selectedQuestionType === "Free Text" && (
                  <div className="col-lg-12">
                    {/* <input type="text" className="input"/> */} {""}
                  </div>
                )}

                {selectedQuestionType === "Multi Select" &&
                  (console.log(editUserInfo.answerlist),
                  (
                    <div className="col-lg-12">
                      <p className="fs-5 text-primary">AnswerOptions</p>
                      <div className="row align-items-start">
                        <div className="col-lg-8">
                          {editUserInfo.answerlist?.map(
                            (answer, index) => (
                              console.log(answer),
                              (
                                <div key={answer.possible_answer_id}>
                                  {/* <div className="col-lg-10"> */}
                                  <MyTextarea
                                    type="text"
                                    value={answer.answer || ""}
                                    style={{ width: "100%" }}
                                    onChange={(e) =>
                                      handleAnswerListChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {/* </div> */}
                                </div>
                              )
                            )
                          )}
                        </div>
                        <div className="col-lg-4 mb-3">
                          <div className="row">
                            <div
                              onClick={addAnswer}
                              className="col-lg-5 btn btn-secondary me-1"
                            >
                              add
                            </div>
                            <div
                              onClick={removeAnswer}
                              className="col-lg-6 btn btn-secondary"
                            >
                              remove
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {selectedQuestionType === "Dropdown" &&
                  (console.log(editUserInfo.answerlist),
                  (
                    <div className="col-lg-12">
                      <p className="fs-5 text-primary">AnswerOptions</p>
                      <div className="row align-items-start">
                        <div className="col-lg-8">
                          {editUserInfo.answerlist?.map(
                            (answer, index) => (
                              console.log(answer),
                              (
                                <div key={answer.possible_answer_id}>
                                  <MyTextarea
                                    type="text"
                                    value={answer.answer}
                                    style={{ width: "100%" }}
                                    onChange={(e) =>
                                      handleAnswerListChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              )
                            )
                          )}
                        </div>
                        <div className="col-lg-4 mb-3">
                          <div className="row">
                            <div
                              onClick={addAnswer}
                              className="col-lg-5 btn btn-secondary me-1"
                            >
                              add
                            </div>
                            <div
                              onClick={removeAnswer}
                              className="col-lg-6 btn btn-secondary"
                            >
                              remove
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {selectedQuestionType === "Radio Button" &&
                  (console.log(editUserInfo.answerlist),
                  (
                    <div className="col-lg-12">
                      <p className="fs-5 text-primary">AnswerOptions</p>
                      <div className="row align-items-start">
                        <div className="col-lg-8">
                          {editUserInfo.answerlist?.map(
                            (answer, index) => (
                              console.log(answer),
                              (
                                <div key={answer.possible_answer_id}>
                                  <div className="row">
                                    <div className="col-lg-8">
                                      <MyTextarea
                                        type="text"
                                        value={answer.answer}
                                        style={{ width: "100%" }}
                                        onChange={(e) =>
                                          handleAnswerListChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="col-lg-4 design">
                                      <div title="Follow up choose one option">
                                        <span className="follow_up text-primary fw-bold">
                                          {" "}
                                          Follow_up
                                        </span>
                                      </div>
                                      <MultiSelect
                                        type="checkbox"
                                        className="follow_input"
                                        checked={
                                          answer.isFollowUpChecked || false
                                        }
                                        onChange={() =>
                                          handleFollowUpChange(index)
                                        }
                                      />
                                    </div>
                                  </div>
                                  {answer.isFollowUpChecked && (
                                    // Your pop-up content here
                                    <div className="">
                                      <form
                                        className=""
                                        onSubmit={handleSubmit}
                                      >
                                        <div className="row">
                                          {/* <div className="col-lg-12"> */}
                                          {editQues?.map((item, index) => (
                                            <div
                                              className={item.column}
                                              key={index}
                                            >
                                              <div className="">
                                                <p className="fs-5 text-primary">
                                                  {item.placeholder}
                                                </p>
                                                {item.type === "checkbox" ? (
                                                  <MultiSelect
                                                    type="checkbox"
                                                    checked={
                                                      isMandaryCheckedFollowUp
                                                    }
                                                    onChange={
                                                      handleMandaryChangeFollowUp
                                                    }
                                                  />
                                                ) : (
                                                  <>
                                                    <MyTextarea
                                                      type="text"
                                                      style={{ width: "100%" }}
                                                      onChange={(e) => {
                                                        setEditUserInfoFollowup(
                                                          {
                                                            ...editUserInfoFollowup,
                                                            question:
                                                              e.target.value,
                                                          }
                                                        );
                                                      }}
                                                      value={
                                                        editUserInfoFollowup.question
                                                      }
                                                    />
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </form>
                                    </div>
                                  )}
                                </div>
                              )
                            )
                          )}
                        </div>
                        <div className="col-lg-4 mb-3">
                          <div className="row">
                            <div
                              onClick={addAnswer}
                              className="col-lg-5 btn btn-secondary me-1"
                            >
                              add
                            </div>
                            <div
                              onClick={removeAnswer}
                              className="col-lg-6 btn btn-secondary"
                            >
                              remove
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="text-end">
            <PrimaryBtn
              onClick={() => close()}
              style={{
                background: "none",
                color: "var(--Colours-Primary-colour-Blue-500)",
                border: "1px solid var(--Colours-Primary-colour-Blue-500)",
              }}
              title=""
            >
              Cancel
            </PrimaryBtn>
            <PrimaryBtn style={{ marginLeft: "1rem" }} type="submit" title="">
              Submit
            </PrimaryBtn>
          </div>
          {confirmMessage && (
            <Toast
              messages={toastmessage}
              onClose={() => setConfirmMessage(false)}
            />
          )}
        </form>
        {showToast && (
          <Toast messages={updateQuestionMessage} onClose={() => close()} />
        )}
      </div>
    </>
  );
};

export default EditQuestion;
