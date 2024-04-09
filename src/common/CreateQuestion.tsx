import React, { useContext, useEffect, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import MyTextarea from "./MyTextarea";
import { stateContext } from "../utills/statecontact";
import RadioBtn from "./RadioBtn";
import MultiSelect from "./MultiSelect";
import UseFetch from "../utills/UseFetch";
import Toast from "./Toast";


const CreateQuestion = ({ close, showToast,
  setShowToast }: { close: any, showToast: any, setShowToast: any }) => {

  const {
    state: {
      user_Data: { user_id, role_id },
      popupData,
    },
    dispatch,
  } = useContext(stateContext);

  console.log(popupData);

  const {
    apiCall: modelCreateQuestionApiCall,
    message: createQuestionMessage,
  } = UseFetch("/questions/singleQuestionInsert", "POST", dispatch);

  console.log("createQuestionMessage", createQuestionMessage);



  const [selectedQuestionType, setSelectedQuestionType] = useState(
    // editUserInfo?.question_type
  );
  console.log(selectedQuestionType);

  const [editUserInfo, setEditUserInfo] = useState({
    question_id: popupData ? popupData?.question_id : "",
    question: popupData ? popupData?.question : "",
    question_type: popupData ? popupData?.question_type : "",
    answerlist: popupData ? popupData?.answerlist : "",
    follow_up: popupData ? popupData?.follow_up : "",
    mandatory: popupData ? popupData?.mandatory : "",
  });

  console.log(editUserInfo);



  const handleSubmit = async (e: any) => {
    console.log('fwiheofhweoi');
    e.preventDefault();
    if (!selectedQuestionType || !editUserInfo.question) {
      alert("Fill the all Status");
      return;
    }


    try {
      alert("welcome ananth");
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const createQuestionpayload = {
        solution_id: popupData?.Qsol_id,
        cat_id: popupData?.Qcat_id,
        subCategory_id: popupData?.Qsubcat_id,
        question: editUserInfo.question,
        question_type: selectedQuestionType,
        mandatory: isMandaryChecked,
        created_by: user_id,
        created_on: utcDate,
        follow_up: null,
        possible_answers: options.length > 0 ? options : null,
      };
      console.log(createQuestionpayload);
      modelCreateQuestionApiCall(createQuestionpayload);
      setShowToast(true);
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleQuestionTypeChange = (event: any) => {
    console.log("entetr handleQuestionTypeChange", event.target.value);
    setSelectedQuestionType(event.target.value);
    setOptions([""]);

    // Check if there are user-specific answerlist and the selected question type matches the user's question type
    // const userAnswerlist = userData?.users?.answerlist || [];

    // setEditUserInfo({
    //   ...editUserInfo,
    //   question_type: event.target.value,
    //   answerlist:
    // event.target.value === userData?.users?.question_type
    // ? userAnswerlist
    // : [],
    // });
  };

  const [options, setOptions] = useState([""]);
  console.log(options);

  const addOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""]);
  };

  const removeOption = () => {
    if (options.length > 1) {
      setOptions((prevOptions) => prevOptions.slice(0, -1));
    }
  };

  const handleInputChange = (index: any, value: number) => {
    setOptions((prevOptions: any) =>
      prevOptions.map((option: any, i: number) => (i === index ? value : option))
    );
  };

  const [isMandaryChecked, setIsMandaryChecked] = useState(
    // editUserInfo?.mandatory == 1 ? true : false
  );
  console.log(isMandaryChecked);

  const handleMandaryChange = (e: any) => {
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
      onChange: (e: any) => {
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


  return (
    <>
      <div id="CreateUser">
        <form className="" onSubmit={handleSubmit}>
          <div className="row">
            {/* <div className="col-lg-12"> */}
            <h3>{popupData ? "Create Question" : ""}</h3>
            {editQues?.map((item: any, index: number) => (
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
                        onBlur={item.onChange}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
            <div className="col-lg-12">
              <div className="row">
                <p className="fs-5 text-primary">Question Type</p>
                {QuetionBtn?.map((item: any, index: number) => (
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

                {selectedQuestionType === "Multi Select" && (
                  <div className="col-lg-12">
                    <p className="fs-5 text-primary">AnswerOptions</p>
                    <div className="row align-items-start">
                      <div className="col-lg-8">
                        {options.map((option: any, index: number) => (
                          <div key={option.id}>
                            <MyTextarea
                              value={option.text}
                              style={{ width: "100%" }}
                              onBlur={(e: any) =>
                                handleInputChange(index, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="col-lg-4">
                        <div className="row">
                          <button onClick={addOption} className="col-lg-5 me-1">

                            add
                          </button>
                          <button onClick={removeOption} className="col-lg-6">

                            remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedQuestionType === "Dropdown" && (
                  <div className="col-lg-12">
                    <p className="fs-5 text-primary">AnswerOptions</p>
                    <div className="row align-items-start">
                      <div className="col-lg-8">
                        {options.map((option: any, index: number) => (
                          <div key={option.id}>
                            <MyTextarea
                              // type="text"
                              value={option.text}
                              // className="input"
                              style={{ width: "100%" }}
                              onBlur={(e: any) =>
                                handleInputChange(index, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="col-lg-4">
                        <div className="row">
                          <button onClick={addOption} className="col-lg-5 me-1">

                            add
                          </button>
                          <button onClick={removeOption} className="col-lg-6">

                            remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedQuestionType === "Radio Button" && (
                  <div className="col-lg-12">
                    <p className="fs-5 text-primary">AnswerOptions</p>
                    <div className="row align-items-start">
                      <div className="col-lg-8">

                        {options.map((option: any, index: number) => (
                          <div key={option.id}>
                            <MyTextarea
                              // type="text"
                              value={option.text}
                              style={{ width: "100%" }}
                              // className="input"
                              onBlur={(e: any) =>
                                handleInputChange(index, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="col-lg-4">
                        <div className="row">
                          <div onClick={addOption} className="col-lg-5 btn btn-secondary me-1">

                            add
                          </div>
                          <div onClick={removeOption} className="col-lg-6 btn btn-secondary">

                            remove
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
              title=''
            >
              Cancel
            </PrimaryBtn>
            <PrimaryBtn style={{ marginLeft: "1rem" }} type="submit" title=''>
              Submit
            </PrimaryBtn>
          </div>
        </form>

      </div>
      {showToast && (
        <Toast messages={createQuestionMessage} onClose={() => close()} />
      )}
    </>
  );
};

export default CreateQuestion;
