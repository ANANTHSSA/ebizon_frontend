import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "../../utills/statecontact";
import PrimaryBtn from "../../common/PrimaryBtn";
import Loading from "../../common/Loading";
import UseFetch from "../../utills/UseFetch";
import { useParams } from "react-router-dom";
import SeconderyBtn from "../../common/SeconderyBtn";
import "../../styles/Summary.scss";
import SummaryCard from "./SummaryCard";
import AnswerCard from "../Answer/AnswerCard";
import Toast from "../../common/Toast";

type SubCategoryInfo = {
  subCategoryId: number;
  sub_cat_name: string;
  qalist: any[];
};
interface CategoryData {
  cat_id: number;
  cat_name: string;
  question_count: number;
  mandatory_count: number;
  answer_count: number;
  locked: number;
}
const SummaryFollow = ({
  selectAnswer,
  setSelectAnswer,
  checkselectAnswer,
  setCheckselectAnswer,
  setFileName,
  token,
  currentSummary,
  setCurrentSummary,
  expandedCategoryIds,
  setExpandedCategoryIds,
  expandedSubCategoryIds,
  setExpandedSubCategoryIds,
  currentQuestions,
  setCurrentQuestions,
  edit,
  setEdit,
  isOpen,
  setIsOpen,
  fileName,
}: {
  selectAnswer: any;
  setSelectAnswer: any;
  checkselectAnswer: any;
  setCheckselectAnswer: any;
  setFileName: any;
  token: any;
  currentSummary: any;
  setCurrentSummary: any;
  expandedCategoryIds: any;
  setExpandedCategoryIds: any;
  expandedSubCategoryIds: any;
  setExpandedSubCategoryIds: any;
  currentQuestions: any;
  setCurrentQuestions: any;
  edit: any;
  setEdit: any;
  isOpen: any;
  setIsOpen: any;
  fileName: any;
}) => {
  const {
    state: {
      mandatory,
      user_Data: { user_id, role_id },
    },
    dispatch,
  } = useContext(stateContext);
  const { solutionId } = useParams();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [lockcategory, setLockcategory] = useState<CategoryData[]>([]);
  const [filterSolution, setFilterSolution] = useState(Number(solutionId));
  const [showToast, setShowToast] = useState(false);
  const [showToastRole, setShowToastRole] = useState(false);
  const [lockiToast, setLockToast] = useState(false);
  const [engineerToast, setEngineerToast] = useState(false);
  const [otherUserToast, setotherUserToast] = useState(false);
  const { data: solution } = UseFetch(
    `/solutions?user_id=${user_id}&role_id=${role_id}&solution_page=1`,
    "GET",
    dispatch
  );

  const {
    data: summaryData,
    setRefetch: setRefetchSummary,
    error: summaryError,
  } = UseFetch(`answers?solution_id=${filterSolution}`, "GET", dispatch);

  /* The above code is a TypeScript React code snippet. */
  let questionData: any;
  if (expandedCategoryIds && expandedSubCategoryIds) {
    const { data: summaryquestionData } = UseFetch(
      `answers?solution_id=${filterSolution}&category_id=${expandedCategoryIds}&subcategory_id=${expandedSubCategoryIds}`,
      "GET",
      dispatch
    );
    questionData = summaryquestionData;
  }

  const {
    data: lock,
    error,
    setRefetch: setRefetchData,
  } = UseFetch(
    `answers/categoriesStatus?solution_id=${filterSolution}&user_id=${user_id}`,
    "GET"
  );

  const { data: mandatoryData, setRefetch: setRefetchMan } = UseFetch(
    `/answers/mandatoryStatus?solution_id=${filterSolution}`,
    "GET"
  );

  const { apiCall: modelLockUnlockApiCall, message: lockUnlockMessage } =
    UseFetch("/categories/lock/solution", "PUT");

  const areAllCategoriesLocked = lockcategory?.every(
    (category) => category.locked === 1
  );

  const mandatoryfilter = categories?.every(
    (item: any) => item.mandatory_filled_status === true
  );

  useEffect(() => {
    setCategories(mandatoryData);
  }, [mandatoryData]);
  useEffect(() => {
    setLockcategory(lock);
  }, [lock]);

  const { apiCall: insertApiCall } = UseFetch("/answers", "POST");

  const { apiCall: updateApiCall } = UseFetch("/answers", "PUT");

  /* The above code is written in TypeScript and React. It is trying to extract the solution name from an
array of solutions based on a filter condition. */
  let solutionName;

  const solutionData = solution?.map((item: any) => item.solution);

  if (solutionData && solutionData.length > 0) {
    const filteredSolution = solutionData[0]?.filter(
      (item: any) => item.solution_id === filterSolution
    );

    solutionName = filteredSolution.map((item: any) => item.solution_name);
  } else {
  }
  const solutionIDsArray = solution
    ?.map((item: any) => item.solutionIDsArray)
    .flat();

    const sol_coming_soon = solution?.map((item: any) => item.sol_coming_soon).flat();
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const expandAll = () => {
    const allCatIds = currentSummary.map(
      (item: any) => item?.category?.cat_id || 0
    );
    setExpandedCategoryIds(allCatIds);
    setRefetchSummary(true);
    // setExpandedSubCategoryIds(
    //   currentSummary
    //     .flatMap((item) => item?.category?.sub_category_list)
    //     .map((subItem) => subItem?.sub_cat_id || 0)
    // );
  };

  const collapseAll = () => {
    setExpandedCategoryIds([]);
    setExpandedSubCategoryIds([]);
    setRefetchSummary(true);
  };

  useEffect(() => {
    if (summaryData) {
      const currentQues: any[] = summaryData?.flatMap(
        (item: any, index: number) => {
          return item?.categorieslist;
        }
      );

      setCurrentSummary(currentQues);
    }
  }, [summaryData]);
  useEffect(() => {
    if (questionData) {
      const currentQues: SubCategoryInfo[] = questionData?.flatMap(
        (item: any, index: number) => {
          return item.categorieslist?.flatMap(
            (category: any, categoryIndex: number) => {
              return category?.category?.sub_category_list;
            }
          );
        }
      ) as SubCategoryInfo[];

      setCurrentQuestions(currentQues);
    }
  }, [questionData]);

  const qulist = currentQuestions[0]?.qalist;
  const toggleCategoryAccordion = (catId: number) => {
    setExpandedCategoryIds((prevIds: any) => {
      if (prevIds.includes(catId)) {
        return [];
      } else {
        return [catId];
      }
    });
  };
  const handleNextClick = async () => {
    try {
      qulist?.forEach(async (item: any) => {
        const questionId = item?.question_id;
        const questionType = item?.question_type;
        const userAnswer = selectAnswer[questionId];


        // console.log("questionType", questionType, questionId);
        if (
          selectAnswer[questionId] !== undefined &&
          questionId &&
          checkselectAnswer[questionId] !== undefined
        ) {
          item?.user_answers?.forEach(async (answer: any) => {
            try {
              const apiUrl = `${process.env.REACT_APP_BASE_URL}/answers/`;
              const ansId = answer.ans_id;
              let formData;
              let resUpload;
              const userAnswer = JSON.stringify(selectAnswer[questionId]);
              const inputDateString = new Date().toISOString();
              const utcDate = inputDateString.slice(0, 19).replace("T", " ");

              const postpayload = {
                question_id: questionId,
                user_answers: userAnswer,
                Remarks: "",
                created_by: 1,
                created_on: utcDate,
                is_active: true,
              };
              const putpayload = {
                question_id: questionId,
                user_answers: JSON.parse(userAnswer),
                Remarks: "",
                updated_by: 1,
                updated_on: utcDate,
                is_active: true,
              };
              if (ansId !== null) {
                if (
                  selectAnswer[questionId]?.length > 0 &&
                  JSON.stringify(selectAnswer[questionId]) !==
                  JSON.stringify(checkselectAnswer[questionId])
                ) {
                  console.log("update1 api call");
                  console.log(selectAnswer[questionId]);
                  console.log(putpayload);
                  if (questionType === "file") {
                    console.log("enter 2nd the file block");

                    let formData;
                    let resUpload;
                    // let response;
                    if (questionType === "file") {
                      console.log("enter 3rd the file block");
                      formData = new FormData();
                      if (fileName !== null) {
                        formData.append("file", fileName); // Assuming 'file' is your File object
                      } // Assuming 'file' is your File object
                      // console.log(formData);

                      resUpload = await fetch(apiUrl + "/upload", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                      });
                      // const resUploadNew = await fileApiCall(apiurl, formData);

                      // await insertFileApiCall(formData);
                      if (resUpload.ok) {
                        console.log("enter 4th the file block");
                        console.log(resUpload, "resUpload");
                        const fileData = await resUpload.json();
                        console.log(fileData, "fileData");
                        // console.log("File insert successfully");
                        // const fileData = resUpload.data.fileName;
                        // console.log(fileData, "fileData");

                        putpayload.user_answers = [
                          {
                            answers: fileData.fileName[0].filename,
                          },
                        ];

                        console.log(
                          putpayload.user_answers,
                          "putpayload.user_answers"
                        );

                        await updateApiCall(putpayload, questionId);
                      }
                    }
                  } else {
                    console.log("insert api call");
                    console.log(postpayload);
                    await updateApiCall(putpayload, questionId);
                  }
                } else {
                  if (
                    selectAnswer[questionId] !== undefined &&
                    (selectAnswer[questionId] === "" ||
                      (Array.isArray(selectAnswer[questionId]) &&
                        selectAnswer[questionId].length === 0)) &&
                    JSON.stringify(selectAnswer[questionId]) !==
                    JSON.stringify(checkselectAnswer[questionId])
                  ) {
                    console.log("update2 api call");
                    console.log(selectAnswer[questionId]);
                    console.log(putpayload);
                    if (questionType === "file") {
                      console.log("enter 2nd the file block");

                      let formData;
                      let resUpload;
                      // let response;
                      if (questionType === "file") {
                        console.log("enter 3rd the file block");
                        formData = new FormData();
                        if (fileName !== null) {
                          formData.append("file", fileName); // Assuming 'file' is your File object
                        } // Assuming 'file' is your File object
                        // console.log(formData);

                        resUpload = await fetch(apiUrl + "/upload", {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}` },
                          body: formData,
                        });
                        // const resUploadNew = await fileApiCall(apiurl, formData);

                        // await insertFileApiCall(formData);
                        if (resUpload.ok) {
                          console.log("enter 4th the file block");
                          console.log(resUpload, "resUpload");
                          const fileData = await resUpload.json();
                          console.log(fileData, "fileData");
                          // console.log("File insert successfully");
                          // const fileData = resUpload.data.fileName;
                          // console.log(fileData, "fileData");

                          putpayload.user_answers = [
                            {
                              answers: fileData.fileName[0].filename,
                            },
                          ];

                          console.log(
                            putpayload.user_answers,
                            "putpayload.user_answers"
                          );

                          await updateApiCall(putpayload, questionId);
                        }
                      }
                    } else {
                      console.log("update api call");
                      await updateApiCall(putpayload, questionId);
                    }
                    // await updateApiCall(putpayload, questionId);
                  } else {
                    // await updateApiCall(putpayload, questionId)
                    console.log(
                      "Skipping update due to null, empty string, or empty array"
                    );
                  }
                }
              } else {
                console.log(selectAnswer[questionId]);
                // Check for null or empty array before inserting
                if (
                  userAnswer !== "null" &&
                  selectAnswer[questionId]?.length > 0
                ) {
                  if (questionType === "file") {
                    console.log("enter 2nd the file block");

                    let formData;
                    let resUpload;
                    // let response;
                    if (questionType === "file") {
                      console.log("enter 3rd the file block");
                      formData = new FormData();
                      if (fileName !== null) {
                        formData.append("file", fileName); // Assuming 'file' is your File object
                      } // Assuming 'file' is your File object
                      // console.log(formData);

                      resUpload = await fetch(apiUrl + "/upload", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                      });
                      // const resUploadNew = await fileApiCall(apiurl, formData);

                      // await insertFileApiCall(formData);
                      if (resUpload.ok) {
                        console.log("enter 4th the file block");
                        console.log(resUpload, "resUpload");
                        const fileData = await resUpload.json();
                        console.log(fileData, "fileData");
                        // console.log("File insert successfully");
                        // const fileData = resUpload.data.fileName;
                        // console.log(fileData, "fileData");

                        postpayload.user_answers = JSON.stringify([
                          {
                            answers: fileData.fileName[0].filename,
                          },
                        ]);

                        // console.log(
                        //   postpayload.user_answers,
                        //   "postpayload.user_answers"
                        // );

                        await insertApiCall(postpayload);
                      }
                    }
                  } else {
                    console.log("insert api call");
                    console.log(postpayload);
                    await insertApiCall(postpayload);
                  }
                } else {
                  console.log("Skipping insert due to null or empty array");
                }
              }
            } catch (error) {
              console.error("Error in inner loop:", error);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error in outer loop:", error);
    }
  };
  /**
   * The function `saveFun` handles saving data and updating state, while the function `editFun` toggles
   * the edit mode.
   * @param {number} subCatId - The `subCatId` parameter is a number that represents the ID of a
   * subcategory.
   */
  const saveFun = (subCatId: number) => {
    handleNextClick();
    setExpandedSubCategoryIds((prevIds: any) => {
      if (prevIds.includes(subCatId)) {
        return [];
      } else {
        return [subCatId];
      }
    });
    setRefetchMan(true);
    setEdit(!edit);
  };

  const role4Message = {
    statusCode: 300,
    status: "Alert",
    message: "Unlock to Edit",
  };
  const otherRoleUser = {
    statusCode: 300,
    status: "Alert",
    message: "Unlock to Edit",
  }
  const editFun = (lock: any) => {


    if (lock === 1 && role_id === 4) {
      setEngineerToast(true);
    }

    else if (lock === 1) {
      setotherUserToast(true);
    }
    else {
      setEdit(!edit);
    }
  }


  const toggleSubCategoryAccordion = (subCatId: number) => {
    setExpandedSubCategoryIds((prevIds: any) => {
      if (prevIds.includes(subCatId)) {
        return [];
      } else {
        return [subCatId];
      }
    });
  };
  const summaryPopup = () => {
    const popupData = {
      showPopup: true,
      solution_id: filterSolution,
      type: "Summary",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };

  const versionPopup = () => {
    sessionStorage.removeItem("mandatory");
    dispatch({
      type: "MANDATORY",
      payload: false,
    });
    const popupData = {
      showPopup: true,
      version_solution_id: filterSolution,
      type: "Description",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };
  const lockAllCategories = () => {
    const inputDateString = new Date().toISOString();
    const utcDate = inputDateString.slice(0, 19).replace("T", " ");
    const lockPayload = {
      lockType: true,
      updated_on: utcDate,
      updated_by: 39,
    };

    modelLockUnlockApiCall(lockPayload, filterSolution);
    setShowToast(true);
    setRefetchData(true);
    collapseAll();
  };

  const unlockAllCategories = () => {
    const inputDateString = new Date().toISOString();
    const utcDate = inputDateString.slice(0, 19).replace("T", " ");
    const lockPayload = {
      lockType: false,
      updated_on: utcDate,
      updated_by: user_id,
    };

    modelLockUnlockApiCall(lockPayload, filterSolution);
    setShowToast(true);
    setRefetchData(true);
    collapseAll();
  };
  const sumbitLockMessage = {
    statusCode: 500,
    status: "Failure",
    message: "Please Lock all Categories",
  };
  const otherRoleMessage = {
    statusCode: 300,
    status: "Alert",
    message: "Not Allow Engineer",
  };
  const lockToast = () => {
    setLockToast(true);
  };
  const otherRole = () => {
    setShowToastRole(true);
  };

  if (summaryError === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }

  return (
    <section id="summary">
      {currentSummary?.length > 0 ? (
        <>
          <div className="row">
            <div className="col-12">
              <div className="filter d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  {/* <span className="dropdown-label me-2">Select Solution </span> */}
                  <div className={`custom-dropdown ${isOpen ? "open" : ""} ms-3`}>
                    <div>
                      <div
                        className="selected-option d-flex justify-content-between align-items-center"
                        onClick={handleToggleDropdown}
                      >
                        {solutionName ? solutionName[0] : "Select an option"}
                        <img
                          src={require("../../assets/Icons/dropDown.png")}
                          width={24}
                          height={24}
                          alt="dropdown-icon"
                        />
                      </div>
                    </div>
                    {isOpen && (
                      <div className="options">
                        {solution?.length > 0 ? (
                          solution?.map((item: any, index: number) => (
                            <>
                              {item.solution?.map(
                                (item: any, index: number) => {
                                  const isBlur = sol_coming_soon.includes(
                                    item.solution_id
                                  );
                                  return (
                                    <div
                                      key={index}
                                      className="option"
                                      style={{
                                        cursor: isBlur
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                      onClick={
                                        !isBlur
                                          ? () => {
                                            setFilterSolution(
                                              item?.solution_id
                                            );
                                            setIsOpen(false);
                                            setRefetchSummary(true);
                                          }
                                          : undefined
                                      } // Set onClick to undefined if isBlur is false (disabled)
                                    >
                                      {item?.solution_name}
                                    </div>
                                  );
                                }
                              )}
                            </>
                          ))
                        ) : (
                          <Loading />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {role_id === 4 ? (
                    <></>
                  ) : (
                    <>
                      <SeconderyBtn onClick={() => lockAllCategories()}>
                        <svg style={{ marginRight: "5px" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M18 8.5H17V6.5C17 3.74 14.76 1.5 12 1.5C9.24 1.5 7 3.74 7 6.5V8.5H6C4.9 8.5 4 9.4 4 10.5V20.5C4 21.6 4.9 22.5 6 22.5H18C19.1 22.5 20 21.6 20 20.5V10.5C20 9.4 19.1 8.5 18 8.5ZM12 17.5C10.9 17.5 10 16.6 10 15.5C10 14.4 10.9 13.5 12 13.5C13.1 13.5 14 14.4 14 15.5C14 16.6 13.1 17.5 12 17.5ZM15.1 8.5H8.9V6.5C8.9 4.79 10.29 3.4 12 3.4C13.71 3.4 15.1 4.79 15.1 6.5V8.5Z" fill="var(--Colours-Primary-colour-Blue-500)" />
                        </svg>
                        Lock all
                      </SeconderyBtn>
                      <SeconderyBtn onClick={() => unlockAllCategories()}>
                        <svg style={{ marginRight: "5px" }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M14.9999 7.08333H14.1666V5.41667C14.1666 3.11667 12.2999 1.25 9.99992 1.25C7.69992 1.25 5.83325 3.11667 5.83325 5.41667H7.49992C7.49992 4.03333 8.61659 2.91667 9.99992 2.91667C11.3833 2.91667 12.4999 4.03333 12.4999 5.41667V7.08333H4.99992C4.08325 7.08333 3.33325 7.83333 3.33325 8.75V17.0833C3.33325 18 4.08325 18.75 4.99992 18.75H14.9999C15.9166 18.75 16.6666 18 16.6666 17.0833V8.75C16.6666 7.83333 15.9166 7.08333 14.9999 7.08333ZM14.9999 17.0833H4.99992V8.75H14.9999V17.0833ZM9.99992 14.5833C10.9166 14.5833 11.6666 13.8333 11.6666 12.9167C11.6666 12 10.9166 11.25 9.99992 11.25C9.08325 11.25 8.33325 12 8.33325 12.9167C8.33325 13.8333 9.08325 14.5833 9.99992 14.5833Z"
                            fill="var(--Colours-Primary-colour-Blue-500)"
                          />
                        </svg>
                        Unlock all
                      </SeconderyBtn>
                    </>
                  )}
                  <SeconderyBtn onClick={expandAll}>
                    <img
                      src={require("../../assets/Icons/expand_more (3).png")}
                      width={25}
                      height={25}
                    />{" "}
                    Expand All
                  </SeconderyBtn>
                  <SeconderyBtn onClick={collapseAll}>
                    <img
                      src={require("../../assets/Icons/expand_less.png")}
                      width={25}
                      height={25}
                    />{" "}
                    Collapse All
                  </SeconderyBtn>
                </div>
              </div>
              <div>
                {currentSummary?.map((item: any, index: number) => (
                  <div
                 
                    key={index}
                    className={`accordion-item ${expandedCategoryIds.includes(item?.category?.cat_id)
                        ? "active1"
                        : ""
                      }`}
                  >
                    <div className="d-flex justify-content-between align-items-center bx-2 mb-3 p-3 accodion-card"  onClick={() =>
                    toggleCategoryAccordion(item?.category?.cat_id || 0)
                  }>
                      <h2>{item?.category?.cat_name}</h2>

                      {expandedCategoryIds.includes(item?.category?.cat_id) ? (
                        <img
                          src={require(`../../assets/Icons/expand_less.png`)}
                          alt="edit"
                          height={35}
                          width={35}
                          style={{
                            background: "transparent",
                            marginLeft: "10px",
                            cursor: "pointer",
                          }}
                          // onClick={() =>
                          //   toggleCategoryAccordion(item?.category?.cat_id || 0)
                          // }
                        />
                      ) : (
                        <img
                          src={require(`../../assets/Icons/dropDown.png`)}
                          alt="edit"
                          height={35}
                          width={35}
                          style={{
                            background: "transparent",
                            marginLeft: "10px",
                            cursor: "pointer",
                          }}
                          // onClick={() =>
                          //   toggleCategoryAccordion(item?.category?.cat_id || 0)
                          // }
                        />
                      )}
                    </div>
                    {expandedCategoryIds.includes(item?.category?.cat_id) && (
                      <div className="summary-subcategory-body">
                        {item?.category?.sub_category_list?.map(
                          (subItem: any, subIndex: number) => (
                            <div
                           
                              key={subIndex}
                              className={`accordion-item ${expandedSubCategoryIds.includes(
                                subItem?.sub_cat_id
                              )
                                  ? "active"
                                  : ""
                                }`}
                            >
                              <div className="d-flex justify-content-between align-items-center bx-2 p-3 accodion-card"  onClick={() =>
                              toggleSubCategoryAccordion(
                                subItem?.sub_cat_id || 0
                              )
                            }>
                                <h2>{subItem?.sub_cat_name}</h2>

                                {expandedSubCategoryIds.includes(
                                  subItem?.sub_cat_id
                                ) ? (
                                  <div>
                                    {edit ? (
                                      <>
                                        <img
                                          onClick={() =>
                                            saveFun(subItem?.sub_cat_id || 0)
                                          }
                                          src={require(`../../assets/Icons/edit.png`)}
                                          alt="edit"
                                          height={35}
                                          width={35}
                                          style={{
                                            background: "transparent",
                                            marginLeft: "10px",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <span
                                          onClick={(e) =>{
                                            e.stopPropagation();
                                            saveFun(subItem?.sub_cat_id || 0);
                                          }
                                            
                                          }
                                          style={{ cursor: "pointer" }}
                                          className="span"
                                        >
                                          Save answers
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          onClick={() => editFun(subItem?.is_locked)}
                                          src={require(`../../assets/Icons/edit.png`)}
                                          alt="edit"
                                          height={35}
                                          width={35}
                                          style={{
                                            background: "transparent",
                                            marginLeft: "10px",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <span
                                          onClick={(e) =>{
                                            e.stopPropagation();
                                            editFun(subItem?.is_locked);
                                          } }
                                          style={{ cursor: "pointer" }}
                                          className="span"
                                        >
                                          Edit answers
                                        </span>
                                      </>
                                    )}

                                    <img
                                      src={require(`../../assets/Icons/expand_less.png`)}
                                      alt="edit"
                                      height={35}
                                      width={35}
                                      style={{
                                        background: "transparent",
                                        marginLeft: "10px",
                                        cursor: "pointer",
                                      }}
                                      // onClick={() =>
                                      //   toggleSubCategoryAccordion(
                                      //     subItem?.sub_cat_id || 0
                                      //   )
                                      // }
                                    />
                                  </div>
                                ) : (
                                  <img
                                    src={require(`../../assets/Icons/dropDown.png`)}
                                    alt="edit"
                                    height={35}
                                    width={35}
                                    style={{
                                      background: "transparent",
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                    }}
                                    // onClick={() =>
                                    //   toggleSubCategoryAccordion(
                                    //     subItem?.sub_cat_id || 0
                                    //   )
                                    // }
                                  />
                                )}
                              </div>
                              {expandedSubCategoryIds.includes(
                                subItem?.sub_cat_id
                              ) && (
                                  <div className="row">
                                    <div className="col-12">
                                      {edit ? (
                                        <AnswerCard
                                          qulist={qulist}
                                          selectAnswer={selectAnswer}
                                          setSelectAnswer={setSelectAnswer}
                                          setCheckselectAnswer={
                                            setCheckselectAnswer
                                          }
                                          setFileName={setFileName}
                                          currentQuestions={currentQuestions}
                                          token={token}
                                        />
                                      ) : (
                                        <SummaryCard
                                          qulist={qulist}
                                          selectAnswer={selectAnswer}
                                          setSelectAnswer={setSelectAnswer}
                                          currentQuestions={currentQuestions}
                                          token={token}
                                        />
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            {mandatoryfilter && (role_id === 3 || role_id === 1 || role_id === 2) ? (
              <>
                {role_id === 4 ? (
                  <></>
                ) : (
                  <>
                    {areAllCategoriesLocked ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: "1.5rem",
                        }}
                      >
                        <PrimaryBtn onClick={() => versionPopup()} title="">
                          submit Version
                        </PrimaryBtn>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: "1.5rem",
                        }}
                      >
                        <PrimaryBtn
                          onClick={() => lockToast()}
                          title=""
                          className="summary_disabled"
                        >
                          Submit
                        </PrimaryBtn>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {role_id === 4 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "1.5rem",
                      }}
                    >
                      <PrimaryBtn
                        onClick={() => otherRole()}
                        className="summary_disabled"
                        title=""
                      >
                        Submit
                      </PrimaryBtn>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "1.5rem",
                    }}
                  >
                    <PrimaryBtn onClick={() => summaryPopup()} title="">
                      Submit
                    </PrimaryBtn>
                  </div>
                )}
              </>
            )}
          </div>
          {showToast && (
            <Toast
              messages={lockUnlockMessage}
              onClose={() => setShowToast(false)}
            />
          )}

          {lockiToast && (
            <Toast
              messages={sumbitLockMessage}
              onClose={() => setLockToast(false)}
            />
          )}
          {showToastRole && (
            <Toast
              messages={otherRoleMessage}
              onClose={() => setShowToastRole(false)}
            />
          )}
          {engineerToast && (
            <Toast
              messages={role4Message}
              onClose={() => setEngineerToast(false)}
            />
          )}
          {otherUserToast && (
            <Toast
              messages={otherRoleUser}
              onClose={() => setotherUserToast(false)}
            />
          )}
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </section>
  );
};

export default SummaryFollow;
