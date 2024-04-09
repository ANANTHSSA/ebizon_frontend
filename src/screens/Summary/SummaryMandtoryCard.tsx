import React, { Fragment, useContext, useEffect, useState } from "react";
import { stateContext } from "../../utills/statecontact";
import PrimaryBtn from "../../common/PrimaryBtn";
import Loading from "../../common/Loading";
import UseFetch from "../../utills/UseFetch";
import { useParams } from "react-router-dom";
import SeconderyBtn from "../../common/SeconderyBtn";
import "../../styles/Summary.scss";
import SummaryCard from "./SummaryCard";
import AnswerCard from "../Answer/AnswerCard";
import ProgressBar from "../../common/ProgressBar";
import { getMantoryCount } from "../../utills/CountFunc";

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
  lock: number;
}
interface CategoryMandatoryDataInfo {
  mandatory_filled_status: boolean;
  cat_name: string;
  cat_id: number;
  answers_count: number;
  mandatory_answers_count: number;
  mandatory_question_count: number;
  lock: number;
}
const SummaryMandtoryCard = ({
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

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filterSolution, setFilterSolution] = useState(
    Number(mandatory?.solution_id)
  );
  const [mandatoryError, setMandatoryError] = useState<Record<string, any>>({});
  const { data: solution, error } = UseFetch(
    `/solutions?user_id=${user_id}&role_id=${role_id}&solution_page=1`,
    "GET",
    dispatch
  );

  const { data: summaryData,setRefetch: setRefetchSummary } = UseFetch(
    `answers/mandatoryQuestions?solution_id=${filterSolution}`,
    "GET",
    dispatch
  );

  let questionData: any;
  if (expandedCategoryIds && expandedSubCategoryIds) {
    const { data: summaryquestionData } = UseFetch(
      `answers?solution_id=${filterSolution}&category_id=${expandedCategoryIds}&subcategory_id=${expandedSubCategoryIds}`,
      "GET",
      dispatch
    );
    questionData = summaryquestionData;
  }

  let solutionName;

  const solutionData = solution?.map((item: any) => item.solution);

  if (solutionData && solutionData.length > 0) {
    const filteredSolution = solutionData[0]?.filter(
      (item: any) => item.solution_id === filterSolution
    );

    solutionName = filteredSolution.map((item: any) => item.solution_name);
  } else {
    // console.log('No solution data available');
  }
  const solutionIDsArray = solution
    ?.map((item: any) => item.solutionIDsArray)
    .flat();
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const { data: categorylock, setRefetch: setRefetchData } = UseFetch(
    `answers/categoriesStatus?solution_id=${filterSolution}&user_id=${user_id}`,
    "GET"
  );
  const filteredData = categories.filter(
    (item: any) => item.mandatory_filled_status === false
  );
  const mandatoryfilter = categories?.every(
    (item: any) => item.mandatory_filled_status === true
  );

  const filteredCategoryLock: any = categorylock?.filter((item: any) =>
    filteredData.some((cat: any) => cat.cat_id === item.cat_id)
  );
  const { data: mandatoryData, setRefetch: setRefetchMan } = UseFetch(
    `/answers/mandatoryStatus?solution_id=${filterSolution}`,
    "GET"
  );

  const { apiCall: insertApiCall } = UseFetch("/answers", "POST");

  const { apiCall: updateApiCall } = UseFetch("/answers", "PUT");
  const { apiCall: modelLockApiCall, message: lockMessage } = UseFetch(
    "/categories/lock",
    "PUT"
  );

  const { apiCall: modelLockUnlockApiCall, message: lockUnlockMessage } =
    UseFetch("/categories/lock/solution", "PUT");
  useEffect(() => {
    setCategories(mandatoryData);
  }, [mandatoryData]);

  const expandAll = () => {
    const allCatIds = currentSummary.map(
      (item: any) => item?.category?.cat_id || 0
    );
    setExpandedCategoryIds(allCatIds);
    // setExpandedSubCategoryIds(
    //   currentSummary
    //     .flatMap((item) => item?.category?.sub_category_list)
    //     .map((subItem) => subItem?.sub_cat_id || 0)
    // );
  };

  const collapseAll = () => {
    setExpandedCategoryIds([]);
    setExpandedSubCategoryIds([]);
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
        console.log("userAnswer", userAnswer);

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
  const editFun = () => {
    setEdit(!edit);
  };

  const toggleSubCategoryAccordion = (subCatId: number) => {
    setExpandedSubCategoryIds((prevIds: any) => {
      if (prevIds.includes(subCatId)) {
        return [];
      } else {
        return [subCatId];
      }
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
    // setShowToast(true);
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
    // setShowToast(true);
    setRefetchData(true);
    collapseAll();
  };

  const lockFunc = (currentLock: any, catid: any) => {
    try {
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const putPayload = {
        lockType: currentLock === 0 ? true : false,
        updated_on: utcDate,
        updated_by: user_id,
      };

      modelLockApiCall(putPayload, catid);
      // setShowToast(true);
      setRefetchData(true);
      toggleCategoryAccordion(catid);
      setCategories((prevCategories) => {
        return prevCategories.map((category) =>
          category.cat_id === catid
            ? { ...category, lockType: currentLock === 0 ? true : false }
            : category
        );
      });
      const updatedCategories = categories.map((item) =>
        item.cat_id === catid ? { ...item, lock: 1 - currentLock } : item
      );

      setCategories(updatedCategories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setMandatoryError((prevMandatoryError) => {
      const updatedMandatoryError = { ...prevMandatoryError };

      qulist?.forEach((question: any) => {
        const { question_id, question_type, user_answers, mandatory, sno } =
          question;

        if (mandatory === 1) {
          // Check if mandatory and answer is not present
          const isAnswerMissing =
            (question_type === "Multi Select" &&
              (!user_answers || user_answers.length === 0)) ||
            ((question_type === "Free Text" ||
              question_type === "Date" ||
              question_type === "Dropdown" ||
              question_type === "Radio Button" ||
              question_type === "file") &&
              (!user_answers || !user_answers[0]?.answer));

          if (isAnswerMissing) {
            updatedMandatoryError[question_id] = `${sno}`;
          } else {
            // Clear any previous errors for this question_id
            delete updatedMandatoryError[question_id];
          }
        }
      });

      return updatedMandatoryError;
    });
  }, [qulist]);

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
    }
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  }

  return (
    <section id="summary">
     
        <div className="row">
        <div className="col-12">
          <div className="filter d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <span className="dropdown-label me-2">Select Solution </span>
              <div className={`custom-dropdown ${isOpen ? "open" : ""}`}>
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
                          {item.solution?.map((item: any, index: number) => {
                            const isBlur = !solutionIDsArray.includes(
                              item.solution_id
                            );
                            return (
                              <div
                                key={index}
                                className="option"
                                style={{
                                  cursor: isBlur ? "not-allowed" : "pointer",
                                }}
                                onClick={
                                  !isBlur
                                    ? () => {
                                        setFilterSolution(item?.solution_id);
                                        setIsOpen(false);
                                        setRefetchSummary(true);
                                      }
                                    : undefined
                                } // Set onClick to undefined if isBlur is false (disabled)
                              >
                                {item?.solution_name}
                              </div>
                            );
                          })}
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
                    <img
                      src={require("../../assets/Icons/lock (1).png")}
                      width={20}
                      height={20}
                      alt="lock"
                    />
                    Lock all
                  </SeconderyBtn>
                  <SeconderyBtn onClick={() => unlockAllCategories()}>
                    <img
                      src={require("../../assets/Icons/lock_open (1).png")}
                      width={20}
                      height={20}
                      alt="lock"
                    />
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
          {currentSummary.length > 0 ? (
            <>
            <div className="summaryMandtorycard">
            {currentSummary?.map((item: any, index: number) => (
              <div
                key={index}
                className={`accordion-item ${
                  expandedCategoryIds.includes(item?.category?.cat_id)
                    ? "active1"
                    : ""
                }`}
              >
                <div className="d-flex justify-content-between align-items-center bx-2 mb-3 p-3 accodion-card">
                  <h2>{item?.category?.cat_name}</h2>
                  {filteredData?.map((catItem: any, catIndex: number) => (
                    <Fragment key={catIndex}>
                      {catItem?.cat_id === item?.category?.cat_id && (
                        <>
                          {
                            <div className="d-flex justify-content-between align-items-center">
                              <ProgressBar
                                progress={catItem?.mandatory_answers_count}
                                maxValue={catItem?.mandatory_question_count}
                              />
                              <span
                                style={{
                                  color:
                                    "var( --Colours-Typography-colours-Default---800)",
                                }}
                              >
                                {(
                                  (catItem?.mandatory_answers_count /
                                    catItem?.mandatory_question_count) *
                                  100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                          }
                        </>
                      )}
                    </Fragment>
                  ))}

                  <div className="d-flex justify-content-center align-items-center">
                    <div className="text-center mx-2 accordion-card-img">
                      {filteredData?.map((catItem: any, catIndex: number) => (
                        <Fragment key={catIndex}>
                          {catItem?.cat_id === item?.category?.cat_id && (
                            <>
                              {getMantoryCount(
                                catItem?.mandatory_answers_count,
                                catItem?.mandatory_question_count
                              )}
                            </>
                          )}
                        </Fragment>
                      ))}
                      {/* {filteredData?.map(
                  (
                    mandatoryItem: CategoryMandatoryDataInfo,
                    innerIndex: number
                  ) => (
                    <Fragment key={innerIndex}>
                      {mandatoryItem?.cat_id === item?.category?.cat_id && (
                        <>
                          {getMantoryCount(
                            mandatoryItem?.mandatory_answers_count,
                            mandatoryItem?.mandatory_question_count
                          )}
                        </>
                      )}
                    </Fragment>
                  )
                )} */}
                    </div>
                    <div className="text-center mx-3 accordion-card-img">
                      {role_id === 4 ? (
                        <></>
                      ) : (
                        <>
                          {filteredCategoryLock[index]?.lock === 0 ? (
                            <>
                              <img
                                style={{ cursor: "pointer" }}
                                className="responsive-image"
                                src={require(`../../assets/Icons/unLock.png`)}
                                alt="lock"
                                width={45}
                                height={45}
                                onClick={() =>
                                  lockFunc(
                                    filteredCategoryLock[index]?.lock,
                                    filteredCategoryLock[index]?.cat_id
                                  )
                                }
                              />
                              <p>Lock</p>
                            </>
                          ) : (
                            <>
                              <img
                                style={{ cursor: "pointer" }}
                                className="responsive-image"
                                src={require(`../../assets/Icons/lock.png`)}
                                alt="lock"
                                width={45}
                                height={45}
                                onClick={() =>
                                  lockFunc(
                                    filteredCategoryLock[index]?.lock,
                                    filteredCategoryLock[index]?.cat_id
                                  )
                                }
                              />
                              <p>Unlock</p>
                            </>
                          )}
                        </>
                      )}
                    </div>
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
                        onClick={() =>
                          toggleCategoryAccordion(item?.category?.cat_id || 0)
                        }
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
                        onClick={() =>
                          toggleCategoryAccordion(item?.category?.cat_id || 0)
                        }
                      />
                    )}
                  </div>
                </div>
                {expandedCategoryIds.includes(item?.category?.cat_id) && (
                  <div className="summary-subcategory-body">
                    {item?.category?.sub_category_list?.map(
                      (subItem: any, subIndex: number) => (
                        <div
                          key={subIndex}
                          className={`accordion-item ${
                            expandedSubCategoryIds.includes(subItem?.sub_cat_id)
                              ? "active"
                              : ""
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center bx-2 p-3 accodion-card">
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
                                      onClick={() =>
                                        saveFun(subItem?.sub_cat_id || 0)
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
                                      onClick={() => editFun()}
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
                                      onClick={() => editFun()}
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
                                  onClick={() =>
                                    toggleSubCategoryAccordion(
                                      subItem?.sub_cat_id || 0
                                    )
                                  }
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
                                onClick={() =>
                                  toggleSubCategoryAccordion(
                                    subItem?.sub_cat_id || 0
                                  )
                                }
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
                                    setCheckselectAnswer={setCheckselectAnswer}
                                    setFileName={setFileName}
                                    currentQuestions={currentQuestions}
                                    token={token}
                                    mandatoryError={mandatoryError}
                                    setMandatoryError={setMandatoryError}
                                  />
                                ) : (
                                  <SummaryCard
                                    qulist={qulist}
                                    selectAnswer={selectAnswer}
                                    setSelectAnswer={setSelectAnswer}
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
            </>
          ):(<>
          <p className="text-center mt-5">No Mandatory Questions</p>
          </>)}
      
          
        </div>
      </div>
      
      
      {mandatoryfilter ? (
        <>
          {role_id === 4 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <PrimaryBtn title=''>Summary</PrimaryBtn>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <PrimaryBtn onClick={() => versionPopup()} title=''>submit Version</PrimaryBtn>
            </div>
          )}
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
            }}
          >
            <PrimaryBtn onClick={() => summaryPopup()} title=''>Submit</PrimaryBtn>
          </div>
        </>
      )}
    </section>
  );
};

export default SummaryMandtoryCard;
