import React, { useContext, useEffect, useState } from "react";
import "../../styles/QuestionModel.scss";
import { UseFetch } from "../../utills/UseFetch";
import { stateContext } from "../../utills/statecontact";
import RadioBtn from "../../common/RadioBtn";
import MyTextarea from "../../common/MyTextarea";
import MultiSelect from "../../common/MultiSelect";
import PrimaryBtn from "../../common/PrimaryBtn";
import * as XLSX from "xlsx";

const QuestionModel = () => {
  const {
    state: {
      user_Data: { user_id, role_id },
      // popupData: { showPopup, type },
    },
    dispatch,
  } = useContext(stateContext);
  const solutionPage = 1;

  // const navigate=useNavigate();

  const { data: solution } = UseFetch(
    `/solutions?user_id=${user_id}&role_id=${role_id}&solution_page=${solutionPage}`,
    "GET",
    dispatch
  );

  const { apiCall: modelBulkApiCall } = UseFetch(
    `/questions/processExcel`,
    "POST",
    dispatch
  );

  const [solutions, setSolutions] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  useEffect(() => {
    setSolutions(solution);
    setCategory(category);
    setSubCategory(subCategory);
  }, [solution, category, subCategory]);
  const [selectedSolution, setSelectedSolution] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const handleSolutionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSolution(selectedValue);
    setSelectedCategory("");
    setSelectedSubCategory("");
  };
  const handleCatChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  };
  const handleSubCatChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSubCategory(selectedValue);
  };

  const { data: categories } = UseFetch(
    `answers/categoriesStatus?solution_id=${selectedSolution}&user_id=${user_id}`,
    "GET",
    dispatch
  );

  const { data: subCategories } = UseFetch(
    `answers/subcategoriesStatus?solution_id=
    ${selectedSolution}&category_id=${selectedCategory}`
  );
  const buildApiUrl = () => {
    let apiUrl = `/questions/excel?solution_id=${selectedSolution}`;

    if (selectedCategory) {
      apiUrl += `&category_id=${selectedCategory}`;
    }

    if (selectedSubCategory) {
      apiUrl += `&subCategory_id=${selectedSubCategory}`;
    }

    return apiUrl;
  };

  const { data, setRefetch } = UseFetch(buildApiUrl(), "GET", dispatch);
  console.log("data", data);

  const { data: allData } = UseFetch(
    `/questions/excel?solution_id=${selectedSolution}`,
    "GET",
    dispatch
  );

  console.log("allData", allData);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  console.log("selectedUser", selectedUser);

  // const handleEditButtonClick = (user) => {

  //   setSelectedUser(user);

  //   if (data?.question_id === user?.question_id) {

  //     setIsPopupOpen(false);
  //   } else {

  //     setIsPopupOpen(!isPopupOpen);
  //     sessionStorage.removeItem("model");
  //     dispatch({
  //       type: "MODEL",
  //       payload: false,
  //     });
  //   }
  // };

  const handleEditButtonClick = (user) => {
    setSelectedUser(user);
    console.log("user", user);

    if (data?.filter((item) => item?.question_id == user?.question_id)) {
      setIsPopupOpen((prev) => !prev);
      setRefetch(true);
    } else {
      setIsPopupOpen(false);
      sessionStorage.removeItem("model");
      dispatch({
        type: "MODEL",
        payload: false,
      });
    }
    setRefetch(true);
  };

  ///////////////////////////////// bulk question insert ////////////////////////
  const [bulkInsert, setBulkInsert] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setBulkInsert(data); // This will display your data in console
      // TODO: call your API endpoint to send this data to your backend
    };
    reader.readAsBinaryString(file);
  };

  const handleFileSubmit = async () => {
    if (!bulkInsert.length) {
      alert("Please upload a file");
      return;
    } else {
      await modelBulkApiCall(bulkInsert);
      alert("Data inserted successfully");
      setBulkInsert("");
    }
  };

  const userActionFun = (action) => {
    console.log("action", action);

    if (action.label === "CreateQuestion") {
      const popupData = {
        showPopup: true,
        type: action.label,
        qlable: action.qlable,
        Qsol_id: selectedSolution,
        Qcat_id: selectedCategory,
        Qsubcat_id: selectedSubCategory,
        ...selectedUser,
      };
      const popupDataString = JSON.stringify(popupData);
      sessionStorage.setItem("Popup", popupDataString);
      dispatch({
        type: "POPUP",
        payload: popupData,
      });
    } else if (action.label === "QEdit") {
      const popupData = {
        showPopup: true,
        userId: action.userId,
        type: "EditQuestion",
        qlable: action.qlable,
        Qsol_id: selectedSolution,
        Qcat_id: selectedCategory,
        Qsubcat_id: selectedSubCategory,
        ...selectedUser,
      };
      const popupDataString = JSON.stringify(popupData);
      sessionStorage.setItem("Popup", popupDataString);
      dispatch({
        type: "POPUP",
        payload: popupData,
      });
    } else {
      const popupData = {
        showPopup: true,
        type: "DeleteQuestion",
        action: action.label,
        qlable: action.qlable,
        Qsol_id: selectedSolution,
        Qcat_id: selectedCategory,
        Qsubcat_id: selectedSubCategory,
        ...selectedUser,
      };
      const popupDataString = JSON.stringify(popupData);
      sessionStorage.setItem("Popup", popupDataString);
      dispatch({
        type: "POPUP",
        payload: popupData,
      });
    }
    setRefetch(true);
  };

  const user_actions = [
    {
      label: "QEdit",
      icon: "M2.99878 17.25V21H6.74878L17.8088 9.94L14.0588 6.19L2.99878 17.25ZM5.91878 19H4.99878V18.08L14.0588 9.02L14.9788 9.94L5.91878 19ZM20.7088 5.63L18.3688 3.29C18.1688 3.09 17.9188 3 17.6588 3C17.3988 3 17.1488 3.1 16.9588 3.29L15.1288 5.12L18.8788 8.87L20.7088 7.04C21.0988 6.65 21.0988 6.02 20.7088 5.63Z",
      qlable: "Edit",
    },
    {
      label: "QDelete",
      icon: "M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z",
      qlable: "Delete",
    },
  ];

  return (
    // <div className="col-lg-3 text-center">
    //       <input
    //         type="file"
    //         className="selected-option"
    //         // accept="API guide (2).xls"
    //         onChange={handleFileUpload}
    //       />
    //       <div className="save-btn" onClick={handleFileSubmit}>
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="24"
    //           height="24"
    //           viewBox="0 0 24 24"
    //           fill="none"
    //         >
    //           <path
    //             d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z"
    //             fill="#171717"
    //           />
    //         </svg>
    //       </div>
    //     </div>
    <section id="QuestionModel">
      <div>
        {" "}
        {/* <span className="mandatory"> * - mandatory</span>
        <span className="followup"> * - followup</span> */}
      </div>
      <div className="row align-items-center mb-5 filter">
        <div className="col text-center">
          <label htmlFor="solutionDropdown">Select  Solution:</label>
        </div>
        <div className="col text-center">
          <select
            id="solutionDropdown"
            className="selected-option1"
            onChange={handleSolutionChange}
            value={selectedSolution}
          >
            <option value="">Select a Solution</option>
            {solutions[0]?.solution?.map((solution) => (
              <option key={solution.solution_id} value={solution.solution_id}>
                {solution.solution_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col text-center">
          <label htmlFor="solutionDropdown">Select category:</label>
        </div>
        <div className="col">
          <select
            id="solutionDropdown"
            className="selected-option1"
            onChange={handleCatChange}
            value={selectedCategory}
          >
            <option value="">Select category</option>
            {categories?.map((solution) => (
              <option key={solution.cat_id} value={solution.cat_id}>
                {solution.cat_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col text-center">
          <label htmlFor="solutionDropdown">Select Subcategory:</label>
        </div>
        <div className="col">
          <select
            id="solutionDropdown"
            className="selected-option1"
            onChange={handleSubCatChange}
            value={selectedSubCategory}
          >
            <option value="">Select a Subcategory</option>
            {subCategories?.map((solution) => (
              <option key={solution.sub_cat_id} value={solution.sub_cat_id}>
                {solution.sub_cat_name}
              </option>
            ))}
          </select>
        </div>

        {selectedSubCategory !== "" ? (
          <div className="col-2 mb-2">
            <PrimaryBtn
              // className="edit-btn1"
              onClick={() =>
                userActionFun({
                  label: "CreateQuestion",
                  icon: "ci:add-plus-circle",
                  qlable: "Create question",
                  Qsol_id: selectedSolution,
                  Qcat_id: selectedCategory,
                  Qsubcat_id: selectedSubCategory,
                  ...selectedUser,
                })
              }
            >
              Create Ques
            </PrimaryBtn>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* {data?.map((question) => ( */}
      <div className="sum-border">
        {data?.map((question, index) => {
          {
            if (question.sno !== 0) {
              return (
                <div className="row align-items-center">
                  <div className="col-lg-5">
                    <p className=""></p>
                    <p className="">
                      {(question.mandatory === 1 || question.follow_up) && (
                        <>
                          {question.mandatory === 1 && (
                            <span className="mandatory">*</span>
                          )}
                          {question.follow_up && (
                            <span className="followup">*</span>
                          )}
                        </>
                      )}
                      {` ${question.question_id} . ${question.question}`}
                    </p>
                  </div>
                  <div className="col-lg-5">
                    {question.question_type === "Free Text" && (
                      <div className="">
                        <MyTextarea
                          type="text"
                          style={{
                            width: "100%",
                            cursor: "not-allowed",
                            backgroundColor:
                              "var(--Colours-Neutral-colours-Gray-100)",
                          }}
                          className="form-control"
                          name={`question_${question.question_id}`}
                          value={
                            question.user_answers &&
                            question.user_answers?.map(
                              (answer) => answer.answer
                            )
                          }
                          disabled={true}
                        />
                      </div>
                    )}

                    {question.question_type === "Multi Select" &&
                      question.question_id && (
                        <div className="">
                          <div className="row">
                            {question.answerlist &&
                              question.answerlist?.map(
                                (answerOption, answerIndex) => {
                                  const isChecked =
                                    question.user_answers?.some((ans) =>
                                      ans.answer?.some(
                                        (nestedAnswer) =>
                                          answerOption.possible_answer_id ===
                                          nestedAnswer.ans_id
                                      )
                                    ) || false; // Set to false if not found
                                  return (
                                    <div
                                      key={answerIndex}
                                      className="col-6 my-3"
                                    >
                                      <label className="d-flex custom-checkbox">
                                        <div>
                                          <MultiSelect
                                            type="checkbox"
                                            name={`question_${question.question_id}`}
                                            value={
                                              answerOption.possible_answer_id
                                            }
                                            disabled={true}
                                            checked={isChecked}

                                            // className="hidden-checkbox"
                                          />
                                        </div>
                                        <div className="ms-2">
                                          {answerOption.answer}
                                        </div>
                                      </label>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      )}

                    <div className="answer-section">
                      <div className="row">
                        <>
                          {
                            question.question_type === "Radio Button" &&
                              question.follow_up == null &&
                              question.answerlist &&
                              question.answerlist?.map(
                                (answerOption, answerIndex) => {
                                  return (
                                    <div>
                                      {" "}
                                      <label className="custom-checkbox">
                                        <RadioBtn
                                          type="radio"
                                          name={`question_${question.question_id}`}
                                          value={answerOption.answer}
                                          // checked={isChecked}
                                          disabled={true}
                                        />
                                      </label>
                                    </div>
                                  );
                                }
                              )

                            // question.question_id &&
                            // question.answerlist &&
                            // question.answerlist?.map(
                            //   (answerOption, answerIndex) => (
                            //     // <div key={answerIndex} className="col-lg-6">
                            //       // <label className="custom-checkbox">
                            //         <RadioBtn
                            //           type="radio"
                            //           name={`question_${question.question_id}`}
                            //           value={answerOption.possible_answer_id}
                            //           disabled={true}
                            //         />
                            //         // {answerOption.answer}
                            //         // {question.follow_up && (
                            //           // <span className="followup">*</span>
                            //         // )}
                            //       // </label>
                            //     // </div>
                            //   )
                            // )
                          }
                        </>

                        {question.question_type === "Radio Button" &&
                          question.follow_up !== null &&
                          question.question_id &&
                          question.answerlist &&
                          question.answerlist?.map(
                            (answerOption, answerIndex) => {
                              const isChecked = question.follow_up.some(
                                (criteria) =>
                                  criteria?.criteria === answerOption.answer
                              );
                              console.log("isChecked", isChecked);

                              let foundItem;
                              console.log(question.follow_up[0].id);
                              if (isChecked) {
                                foundItem = allData.find(
                                  (item) =>
                                    item.question_id ===
                                    question.follow_up[0].id
                                );
                                console.log("foundItem", foundItem);
                              }

                              return (
                                <>
                                  <div key={answerIndex} className="col-lg-6">
                                    <label className="custom-checkbox">
                                      <RadioBtn
                                        type="radio"
                                        name={`question_${question.question_id}`}
                                        value={answerOption.answer}
                                        checked={isChecked}
                                        disabled={true}
                                      />
                                      {/* {answerOption.answer} */}
                                    </label>
                                    <br />
                                    {isChecked ? (
                                      foundItem && ( // Render foundItem only if isChecked is true and foundItem exists
                                        <>
                                          <p>{foundItem.question}</p>
                                          <MyTextarea
                                            type="text"
                                            style={{
                                              width: "100%",
                                              cursor: "not-allowed",
                                              backgroundColor:
                                                "var(--Colours-Neutral-colours-Gray-100)",
                                            }}
                                            name={`question_${question.question_id}`} // Ensure name attribute is unique
                                            // value={answerOption.answer}
                                            disabled={true}
                                          />
                                        </>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </>
                              );
                            }
                          )}
                      </div>
                    </div>
                    {question.question_type === "file" &&
                      question.question_id && (
                        <div>
                          <a
                            className="download-file"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          ></a>
                        </div>
                      )}

                    {question.question_type === "Dropdown" &&
                      question.question_id && (
                        <div className="answer-section">
                          <select
                            style={{
                              width: "100%",
                              cursor: "not-allowed",
                              backgroundColor:
                                "var(--Colours-Neutral-colours-Gray-100)",
                            }}
                            className="form-control"
                            disabled={true}
                          >
                            <option value="" disabled>
                              Select an option
                            </option>
                            {question.answerlist?.map(
                              (answerOption, answerIndex) => (
                                <option
                                  key={answerIndex}
                                  value={answerOption.answer}
                                  className="drop-input"
                                >
                                  {answerOption.answer}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      )}
                    <div>
                      {/* {question.question === "Start Date" &&
                     question.question_type === "Date" &&
                     question.question_id && (
                       <div className="answer-section">
                         <div>
                           <MyTextarea
                             type="text"
                             name={`start_date_${question.question_id}`}
                             value={
                               question.user_answers &&
                               question.user_answers?.map(
                                 (answer) => answer.answer
                               )
                             }
                             disabled={true}
                           />
                         </div>
                       </div>
                     )}
                   {question.question === "End Date" &&
                     question.question_type === "Date" &&
                     question.question_id && (
                       <div className="answer-section">
                         <div>
                           <MyTextarea
                             type="text"
                             name={`start_date_${question.question_id}`}
                             value={
                               question.user_answers &&
                               question.user_answers?.map(
                                 (answer) => answer.answer
                               )
                             }
                             disabled={true}
                           />
                         </div>
                       </div>
                     )} */}
                    </div>

                    {question.question_type === "Date" &&
                      question.question_id && (
                        <div className="answer-section">
                          <div>
                            <MyTextarea
                              type="date"
                              name={`start_date_${question.question_id}`}
                              value={
                                question.user_answers &&
                                question.user_answers?.map(
                                  (answer) => answer.answer
                                )
                              }
                              style={{
                                width: "100%",
                                cursor: "not-allowed",
                                backgroundColor:
                                  "var(--Colours-Neutral-colours-Gray-100)",
                              }}
                              className="form-control"
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}

                    <p>
                      {question.question_type &&
                      question.question_id &&
                      question.question_type.startsWith("{") ? (
                        JSON.parse(question.question_type).Link === "link" ? (
                          <a
                            href={JSON.parse(question.question_type).url}
                            target="_blank"
                          >
                            {JSON.parse(question.question_type).name}
                          </a>
                        ) : (
                          question.question_type.name
                        )
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                  {selectedSubCategory !== "" ? (
                    <div className="col-lg-2">
                      {data
                        ?.filter(
                          (item) => item.question_id === question.question_id
                        )
                        ?.map(
                          (item, index) => (
                            console.log("item in user id ", item),
                            (
                              <div key={index}>
                                {isPopupOpen &&
                                  selectedUser &&
                                  selectedUser.question_id ===
                                    item.question_id && (
                                    <div className="popup">
                                      <div className="popup-content">
                                        <ul className="list-unstyled">
                                          {user_actions?.map(
                                            (action, index) => (
                                              <li
                                                className="container"
                                                key={index}
                                              >
                                                <div
                                                  className="row align-items-center"
                                                  onClick={() =>
                                                    userActionFun(action)
                                                  }
                                                >
                                                  <div className="d-flex">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="24"
                                                      height="24"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                    >
                                                      <path
                                                        d={action.icon}
                                                        fill="#171717"
                                                      />
                                                    </svg>

                                                    <div className="ms-2">
                                                      <p>{action.qlable}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                <button
                                  className="edit-btn"
                                  onClick={() => handleEditButtonClick(item)}
                                >
                                  <img
                                    style={{ cursor: "pointer" }}
                                    src={require("../../assets/Icons/Style=Two Tone (2).png")}
                                    alt="action"
                                  />
                                </button>
                              </div>
                            )
                          )
                        )}
                    </div>
                  ) : (
                    ""
                  )}
                  <hr />
                </div>
              );
            }
          }
        })}
      </div>
    </section>
  );
};

export default QuestionModel;
