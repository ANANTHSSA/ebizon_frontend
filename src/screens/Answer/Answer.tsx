import React, { useContext, useEffect, useRef, useState } from "react";
import { UseFetch } from "../../utills/UseFetch";
import ProgressBar from "../../common/ProgressBar";
import "../../styles/Answer.scss";
import { stateContext } from "../../utills/statecontact";
import "../../styles/Answer.scss";
import AnswerCard from "./AnswerCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PrimaryBtn from "../../common/PrimaryBtn";
import Loading from "../../common/Loading";
import SeconderyBtn from "../../common/SeconderyBtn";
import Toast from "../../common/Toast";
import SaveLoading from "../../common/SaveLoading";

interface SubCateMandatoryDataInfo {
  solution_id: number;
  solution_name: string;
  cat_id: number;
  cat_name: string;
  sub_cat_id: number;
  sub_cat_order_id: number;
  sub_cat_name: string;
  mandatory_count: number;
  question_count: number;
  answers_count: number;
}

type SubCategoryInfo = {
  subCategoryId: number;
  sub_cat_name: string;
  qalist: any[];
};

interface CategoryData {
  solution_id: number;
  solution_name: string;
  cat_id: number;
  cat_name: string;
  question_count: number;
  mandatory_count: number;
  answer_count: number;
  locked: number;
}

const Answer = () => {
  // const { solutionId, user_id } = useContext(stateContext);es(datas);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const questionsPerPage = 1;
  const { solutionId, catId, subCatId, subcatOrderId } = useParams();
  console.log(solutionId, catId, subCatId, subcatOrderId);
  let categoryId = catId ? parseInt(catId, 10) : undefined;

  const location = useLocation();
  const navigate = useNavigate();
  const subCatIdNumber = subCatId ? parseInt(subCatId, 10) : undefined;
  const subcatOrderIdNumber = subcatOrderId
    ? parseInt(subcatOrderId, 10)
    : undefined;
  const [currentPage, setCurrentPage] = useState<number | undefined>(
    subCatIdNumber
  );
  const [totalPages, setTotalPages] = useState<number | undefined>(
    subcatOrderIdNumber
  );

  const [currentQuestions, setCurrentQuestions] = useState<SubCategoryInfo[]>(
    []
  );
  const [selectAnswer, setSelectAnswer] = useState<Record<string, any>>({});
  const [fileName, setFileName] = useState<null>(null);

  const [file1, setFile1] = useState(true);

  const [checkselectAnswer, setCheckselectAnswer] = useState<
    Record<string, any>
  >({});

  const [selectedFileAnswer, setSelectedFileAnswer] = useState<
    Record<string, any>
  >({});

  const {
    state: {
      token,
      user_Data: { user_id, role_id },
    },
    dispatch,
  } = useContext(stateContext);

  const { apiCall: modelLockApiCall, message: lockMessage } = UseFetch(
    "/categories/lock",
    "PUT"
  );

  const {
    data,
    error: questionError,
    setRefetch: setRefetchQuestion,
  } = UseFetch(
    `answers?solution_id=${solutionId}&category_id=${catId}&subcategory_id=${currentPage}`,
    "GET"
  );

  const {
    data: designData,
    setRefetch: setRefetchCatid,
    error: subcategoryError,
  } = UseFetch(
    `answers/subcategoriesStatus?solution_id=${solutionId}&category_id=${catId}`,
    "GET"
  );

  const Locked = data.flatMap((solutionData: any) =>
    solutionData.categorieslist.map(
      (categoryData: any) => categoryData.category.is_locked
    )
  );

  const isLocked = Locked?.join(",");

  const lockFunc = (currentLock: any, catid: any) => {
    console.log(currentLock, catid);

    try {
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const putPayload = {
        lockType: currentLock == 0 ? true : false,
        updated_on: utcDate,
        updated_by: user_id,
      };

      modelLockApiCall(putPayload, catid);
      setShowToastLock(true);

      setRefetchQuestion(true);

      setCategories((prevCategories) => {
        return prevCategories.map((category: any) =>
          category.cat_id == catid
            ? { ...category, lockType: currentLock === 0 ? true : false }
            : category
        );
      });
      const updatedCategories = categories.map((item) =>
        item.cat_id == catid ? { ...item, locked: 1 - currentLock } : item
      );

      setCategories(updatedCategories);
    } catch (error) {
      console.error(error);
    }
  };
  const [data1, setData] = useState<SubCateMandatoryDataInfo[]>([]);

  const solutionName = data1[0]?.solution_name;

  const catName = data1[0]?.cat_name;

  useEffect(() => {
    setData(designData);
  }, [designData]);

  const { apiCall: insertApiCall, message: insertMessage } = UseFetch(
    "/answers",
    "POST"
  );
  console.log(insertMessage, "insertMessage");

  const {
    apiCall: updateApiCall,
    message: updateMessage,
    setRefetch: updateSetRefetch,
  }: { apiCall: any; message: any; setRefetch: any } = UseFetch(
    "/answers",
    "PUT"
  );

  console.log(updateMessage);

  // filtering design data based on subcategory id and assigning it to currentQuestions state variable--------->

  const filteredArray = designData?.filter(
    (item: SubCateMandatoryDataInfo) => item.sub_cat_id === currentPage
  );

  const subCategoryIds = designData?.map(
    (item: SubCateMandatoryDataInfo) => item.sub_cat_id
  );
  const indexOfLastQuestion = subCategoryIds
    ? subCategoryIds[subCategoryIds.length - 1]
    : undefined;
  const indexOfFirstQuestion =
    currentPage !== undefined ? currentPage * questionsPerPage : undefined;

  const subOrderIds = designData?.map(
    (item: SubCateMandatoryDataInfo) => item.sub_cat_order_id
  );
  const indexOfLastSubCategory = subOrderIds
    ? subOrderIds[subOrderIds.length - 1]
    : undefined;
  const indexFirstSubCategory =
    totalPages !== undefined ? totalPages * questionsPerPage : undefined;

  ////////////////// index based prev next sub cat name ////////////////////
  const subCategoryAtIndex =
    data1[indexFirstSubCategory != null ? indexFirstSubCategory - 1 : -2];

  const prevSubCategoryAtIndex =
    data1[indexFirstSubCategory != null ? indexFirstSubCategory - 2 : -1];

  const [preSubCatName, setPreSubCatName] = useState<string | undefined>(
    undefined
  );

  const [nextSubCatName, setNextSubCatName] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (prevSubCategoryAtIndex) {
      const prevSubCatName = prevSubCategoryAtIndex.sub_cat_name;
      setPreSubCatName(prevSubCatName);
    } else {
      console.log("No previous sub-category found");
    }

    if (subCategoryAtIndex) {
      let subCatName = subCategoryAtIndex.sub_cat_name;
      if (subCatName === subCategoryAtIndex.sub_cat_name) {
        subCatName = "No Next Sub Category";
      }
      setNextSubCatName(subCatName);
    } else {
      console.log("No next sub-category found");
    }
  }, [prevSubCategoryAtIndex, subCategoryAtIndex]);

  // Additional useEffect to handle updates when indexFirstSubCategory changes
  useEffect(() => {
    const subCategoryAtIndex =
      data1[indexFirstSubCategory != null ? indexFirstSubCategory - 0 : 1];
    const prevSubCategoryAtIndex =
      data1[indexFirstSubCategory != null ? indexFirstSubCategory - 2 : -1];

    if (prevSubCategoryAtIndex) {
      const prevSubCatName = prevSubCategoryAtIndex.sub_cat_name;
      setPreSubCatName(prevSubCatName);
    } else {
      console.log("No previous sub-category found");
    }

    if (subCategoryAtIndex) {
      const subCatName = subCategoryAtIndex.sub_cat_name;

      setNextSubCatName(subCatName);
    } else {
      console.log("No next sub-category found");
    }
  }, [data1, indexFirstSubCategory]);

  // const subCatpageNumber = [];
  // for (let i = 1; indexOfLastSubCategory && i <= Math.ceil(indexOfLastSubCategory / questionsPerPage); i++) {
  //   subCatpageNumber.push(i);
  // }

  // const pageNumbers = [];
  // for (let i = 1; indexOfLastQuestion && i <= Math.ceil(indexOfLastQuestion / questionsPerPage); i++) {
  //   pageNumbers.push(i);
  // }

  ///////////////////// toast /////////////////////

  const [showToast1, setShowToast1] = React.useState(false);
  const [showToastLock, setShowToastLock] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const otherRoleMessage1 = {
    statusCode: 300,
    status: "Success",
    message: "Final Answer Saved Successfully",
  };

  useEffect(() => {
    if (data) {
      const currentQues: SubCategoryInfo[] = data?.flatMap(
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
  }, [data]);

  const qulist = currentQuestions[0]?.qalist;

  const handleNextClick = async () => {
    setRefetchQuestion(true);
    if (topRef.current) {
      if ("scrollBehavior" in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    try {
      qulist?.forEach(async (item: any) => {
        const questionId = item?.question_id;
        const questionType = item?.question_type;
        const userAnswer = selectAnswer[questionId];

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
              console.log("postpayload", postpayload);

              const putpayload = {
                question_id: questionId,
                user_answers: JSON.parse(userAnswer),
                Remarks: "",
                updated_by: 1,
                updated_on: utcDate,
                is_active: true,
              };
              console.log("putpayload", putpayload);

              if (ansId !== null) {
                if (
                  selectAnswer[questionId]?.length > 0 &&
                  JSON.stringify(selectAnswer[questionId]) !==
                    JSON.stringify(checkselectAnswer[questionId])
                ) {
                  // console.log("enter 1st the file block");
                  // console.log(selectAnswer[questionId]);
                  // console.log(putpayload);
                  if (questionType === "file") {
                    // console.log("enter 2nd the file block");

                    let formData;
                    let resUpload;
                    // let response;
                    if (questionType === "file") {
                      // console.log("enter 3rd the file block");
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
                        // console.log("enter 4th the file block");
                        // console.log(resUpload, "resUpload");
                        const fileData = await resUpload.json();
                        // console.log(fileData, "fileData");
                        // console.log("File insert successfully");
                        // const fileData = resUpload.data.fileName;
                        // console.log(fileData, "fileData");

                        putpayload.user_answers = [
                          {
                            answers: fileData.fileName[0].filename,
                          },
                        ];

                        // console.log(
                        //   putpayload.user_answers,
                        //   "putpayload.user_answers"
                        // );

                        await updateApiCall(putpayload, questionId);
                        console.log("File insert successfully");
                        console.log(putpayload);
                      }
                    }
                  } else {
                    // console.log("insert api call");
                    console.log(putpayload);
                    await updateApiCall(putpayload, questionId);
                  }
                } else {
                  console.log("else block");
                  console.log(selectAnswer[questionId]);

                  if (
                    selectAnswer[questionId] !== undefined &&
                    (selectAnswer[questionId] === "" ||
                      (Array.isArray(selectAnswer[questionId]) &&
                        selectAnswer[questionId].length === 0)) &&
                    JSON.stringify(selectAnswer[questionId]) !==
                      JSON.stringify(checkselectAnswer[questionId])
                  ) {
                    // console.log("update2 api call");
                    // console.log(selectAnswer[questionId]);
                    // console.log(putpayload);
                    if (questionType === "file") {
                      // console.log("enter 2nd the file block");

                      let formData;
                      let resUpload;
                      // let response;
                      if (questionType === "file") {
                        // console.log("enter 3rd the file block");
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
                          // console.log("enter 4th the file block");
                          // console.log(resUpload, "resUpload");
                          const fileData = await resUpload.json();
                          // console.log(fileData, "fileData");
                          // console.log("File insert successfully");
                          // const fileData = resUpload.data.fileName;
                          // console.log(fileData, "fileData");

                          putpayload.user_answers = [
                            {
                              answers: fileData.fileName[0].filename,
                            },
                          ];

                          // console.log(
                          //   putpayload.user_answers,
                          //   "putpayload.user_answers"
                          // );

                          await updateApiCall(putpayload, questionId);
                          console.log(putpayload);
                        }
                      }
                    } else {
                      console.log("update api call");
                      await updateApiCall(putpayload, questionId);
                      console.log(putpayload);
                    }
                    // await updateApiCall(putpayload, questionId);
                  } else {
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
                    // console.log("enter 2nd the file block");

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
                        // console.log("enter 4th the file block");
                        // console.log(resUpload, "resUpload");
                        const fileData = await resUpload.json();
                        // console.log(fileData, "fileData");
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
                        console.log(postpayload);
                      }
                    }
                  } else {
                    // console.log("insert api call");
                    // console.log(postpayload);
                    await insertApiCall(postpayload);
                    console.log(postpayload);
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
    if (
      indexFirstSubCategory !== undefined &&
      indexOfLastSubCategory !== undefined &&
      indexOfFirstQuestion !== undefined &&
      indexOfLastQuestion !== undefined &&
      indexFirstSubCategory < indexOfLastSubCategory &&
      indexOfFirstQuestion < indexOfLastQuestion
    ) {
      setTotalPages((prevTotal) =>
        prevTotal !== undefined ? prevTotal + 1 : undefined
      );
      setCurrentPage((prevPage) =>
        prevPage !== undefined ? prevPage + 1 : undefined
      );
      setRefetchQuestion(true);
    } else if (
      indexFirstSubCategory !== undefined &&
      indexOfLastSubCategory !== undefined &&
      indexOfFirstQuestion !== undefined &&
      indexOfLastQuestion !== undefined &&
      indexFirstSubCategory >= indexOfLastSubCategory &&
      indexOfFirstQuestion >= indexOfLastQuestion
    ) {
      // if(updateMessage1?.statusCode === 200){
      //   setRefetchCatid(true);
      //   setShowToast1(true);
      //   updateSetRefetch(true);
      // }

      setShowToast1(true);
      setRefetchCatid(true);
      setRefetchQuestion(true);
    }
  };

  const handlePreviousClick = async () => {
    setRefetchCatid(true);
    if (topRef.current) {
      console.log("scrollBehavior" in document.documentElement.style);

      if ("scrollBehavior" in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    // try {
    //   qulist?.forEach(async (item) => {
    //     const questionId = item?.question_id;
    //     const questionType = item?.question_type;

    //     if (
    //       selectAnswer[questionId] !== undefined &&
    //       questionId &&
    //       checkselectAnswer[questionId] !== undefined
    //     ) {
    //       item?.user_answers?.forEach(async (answer: any) => {
    //         try {
    //           const ansId = answer.ans_id;
    //           const apiUrl = `${process.env.REACT_APP_BASE_URL}/answers`;
    //           const userAnswer = JSON.stringify(selectAnswer[questionId]);
    //           const inputDateString = new Date().toISOString();
    //           const utcDate = inputDateString.slice(0, 19).replace("T", " ");

    //           const postpayload = {
    //             question_id: questionId,
    //             user_answers: userAnswer,
    //             Remarks: "",
    //             created_by: 0,
    //             created_on: utcDate,
    //             is_active: true,
    //           };
    //           const putpayload = {
    //             question_id: questionId,
    //             user_answers: JSON.parse(userAnswer),
    //             Remarks: "",
    //             updated_by: 0,
    //             updated_on: utcDate,
    //             is_active: true,
    //           };

    //           if (ansId !== null) {
    //             if (
    //               selectAnswer[questionId]?.length > 0 &&
    //               JSON.stringify(selectAnswer[questionId]) !==
    //               JSON.stringify(checkselectAnswer[questionId])
    //             ) {
    //               console.log("update1 api call");
    //               console.log(selectAnswer[questionId]);
    //               console.log(putpayload);
    //               await updateApiCall(putpayload, questionId);
    //             } else {
    //               if (
    //                 selectAnswer[questionId] !== undefined &&
    //                 (selectAnswer[questionId] === "" ||
    //                   (Array.isArray(selectAnswer[questionId]) &&
    //                     selectAnswer[questionId].length === 0)) &&
    //                 JSON.stringify(selectAnswer[questionId]) !==
    //                 JSON.stringify(checkselectAnswer[questionId])
    //               ) {
    //                 console.log("update2 api call");
    //                 console.log(selectAnswer[questionId]);
    //                 console.log(putpayload);
    //                 if (questionType === "file") {
    //                   console.log("enter 2nd the file block");

    //                   let formData;
    //                   let resUpload;
    //                   // let response;

    //                   formData = new FormData();
    //                   if (fileName !== null) {
    //                     formData.append("file", fileName); // Assuming 'file' is your File object
    //                   } // Assuming 'file' is your File object
    //                   // console.log(formData);

    //                   resUpload = await fetch(apiUrl + "/upload", {
    //                     method: "POST",
    //                     headers: { "Authorization": `Bearer ${token}` },
    //                     body: formData,
    //                   });
    //                   // const resUploadNew = await fileApiCall(apiurl, formData);
    //                   if (resUpload.ok) {
    //                     console.log(resUpload, "resUpload");
    //                     const fileData = await resUpload.json();
    //                     // console.log("File insert successfully");
    //                     // const fileData = resUpload.data.fileName;
    //                     // console.log(fileData, "fileData");

    //                     putpayload.user_answers = [
    //                       {
    //                         answers: fileData.fileName[0].filename,
    //                       },
    //                     ];

    //                     // console.log(
    //                     //   putpayload.user_answers,
    //                     //   "postpayload.user_answers"
    //                     // );

    //                     await updateApiCall(putpayload, questionId);
    //                   } else {
    //                     await updateApiCall(putpayload, questionId);
    //                     console.log("enter the else insert block");
    //                     console.error("File insert failed");
    //                     // Handle the failure as needed
    //                   }
    //                 }
    //               } else {
    //                 console.log(
    //                   "Skipping update due to null, empty string, or empty array"
    //                 );
    //               }
    //             }
    //           } else {
    //             console.log(selectAnswer[questionId]);
    //             // Check for null or empty array before inserting
    //             if (
    //               userAnswer !== "null" &&
    //               selectAnswer[questionId]?.length > 0
    //             ) {
    //               if (questionType === "file") {
    //                 console.log("enter 2nd the file block");

    //                 let formData;
    //                 let resUpload;
    //                 // let response;
    //                 if (questionType === "file") {
    //                   console.log("enter 3rd the file block");
    //                   formData = new FormData();
    //                   if (fileName !== null) {
    //                     formData.append("file", fileName); // Assuming 'file' is your File object
    //                   } // Assuming 'file' is your File object
    //                   // console.log(formData);

    //                   resUpload = await fetch(apiUrl + "/upload", {
    //                     method: "POST",
    //                     headers: { "Authorization": `Bearer ${token}` },
    //                     body: formData,
    //                   });
    //                   // const resUploadNew = await fileApiCall(apiurl, formData);

    //                   // await insertFileApiCall(formData);
    //                   if (resUpload.ok) {
    //                     console.log("enter 4th the file block");
    //                     console.log(resUpload, "resUpload");
    //                     const fileData = await resUpload.json();
    //                     console.log(fileData, "fileData");
    //                     // console.log("File insert successfully");
    //                     // const fileData = resUpload.data.fileName;
    //                     // console.log(fileData, "fileData");

    //                     postpayload.user_answers = JSON.stringify([
    //                       {
    //                         answers: fileData.fileName[0].filename,
    //                       },
    //                     ]);

    //                     // console.log(
    //                     //   postpayload.user_answers,
    //                     //   "postpayload.user_answers"
    //                     // );

    //                     await insertApiCall(postpayload);
    //                   }
    //                 }
    //               } else {
    //                 console.log("insert api call");
    //                 console.log(postpayload);
    //                 await insertApiCall(postpayload);
    //               }
    //             } else {
    //               console.log("Skipping insert due to null or empty array");
    //             }
    //           }
    //         } catch (error) {
    //           console.error("Error in inner loop:", error);
    //         }
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error("Error in outer loop:", error);
    // }
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
                created_by: user_id,
                created_on: utcDate,
                is_active: true,
              };
              const putpayload = {
                question_id: questionId,
                user_answers: JSON.parse(userAnswer),
                Remarks: "",
                updated_by: user_id,
                updated_on: utcDate,
                is_active: true,
              };
              if (ansId !== null) {
                if (
                  selectAnswer[questionId]?.length > 0 &&
                  JSON.stringify(selectAnswer[questionId]) !==
                    JSON.stringify(checkselectAnswer[questionId])
                ) {
                  // console.log("update1 api call");
                  console.log(selectAnswer[questionId]);
                  console.log(putpayload);
                  if (questionType === "file") {
                    // console.log("enter 2nd the file block");

                    let formData;
                    let resUpload;
                    // let response;
                    if (questionType === "file") {
                      // console.log("enter 3rd the file block");
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
                        // console.log("enter 4th the file block");
                        // console.log(resUpload, "resUpload");
                        const fileData = await resUpload.json();
                        // console.log(fileData, "fileData");
                        // console.log("File insert successfully");
                        // const fileData = resUpload.data.fileName;
                        // console.log(fileData, "fileData");

                        putpayload.user_answers = [
                          {
                            answers: fileData.fileName[0].filename,
                          },
                        ];

                        // console.log(
                        //   putpayload.user_answers,
                        //   "putpayload.user_answers"
                        // );

                        await updateApiCall(putpayload, questionId);
                      }
                    }
                  } else {
                    // console.log("insert api call");
                    // console.log(postpayload);
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
                    // console.log("update2 api call");
                    // console.log(selectAnswer[questionId]);
                    // console.log(putpayload);
                    if (questionType === "file") {
                      console.log("enter 2nd the file block");

                      let formData;
                      let resUpload;
                      // let response;
                      if (questionType === "file") {
                        // console.log("enter 3rd the file block");
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
                          // console.log("enter 4th the file block");
                          // console.log(resUpload, "resUpload");
                          const fileData = await resUpload.json();
                          // console.log(fileData, "fileData");
                          // console.log("File insert successfully");
                          // const fileData = resUpload.data.fileName;
                          // console.log(fileData, "fileData");

                          putpayload.user_answers = [
                            {
                              answers: fileData.fileName[0].filename,
                            },
                          ];

                          // console.log(
                          //   putpayload.user_answers,
                          //   "putpayload.user_answers"
                          // );

                          await updateApiCall(putpayload, questionId);
                        }
                      }
                    } else {
                      // console.log("update api call");
                      await updateApiCall(putpayload, questionId);
                    }
                    // await updateApiCall(putpayload, questionId);
                  } else {
                    console.log(
                      "Skipping update due to null, empty string, or empty array"
                    );
                  }
                }
              } else {
                // console.log(selectAnswer[questionId]);
                // Check for null or empty array before inserting
                if (
                  userAnswer !== "null" &&
                  selectAnswer[questionId]?.length > 0
                ) {
                  if (questionType === "file") {
                    // console.log("enter 2nd the file block");

                    let formData;
                    let resUpload;
                    // let response;
                    if (questionType === "file") {
                      // console.log("enter 3rd the file block");
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
                        // console.log("enter 4th the file block");
                        // console.log(resUpload, "resUpload");
                        const fileData = await resUpload.json();
                        // console.log(fileData, "fileData");
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
                    // console.log("insert api call");
                    // console.log(postpayload);
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
    if (
      indexOfFirstQuestion !== undefined &&
      indexOfLastQuestion !== undefined &&
      indexFirstSubCategory !== undefined &&
      indexOfLastSubCategory !== undefined &&
      indexOfFirstQuestion <= indexOfLastQuestion &&
      indexFirstSubCategory <= indexOfLastSubCategory
    ) {
      setCurrentPage((prevPage) =>
        prevPage && prevPage > 1 ? prevPage - 1 : prevPage
      );
      setTotalPages((prevTotal) =>
        prevTotal && prevTotal > 1 ? prevTotal - 1 : prevTotal
      );
      setRefetchQuestion(true);

      setFile1(false);
      setFileName(null);
    }
  };
  if (questionError === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }

  // console.log("summaryPage", summaryPage);

  const close = () => {
    setShowToast1(false);
  };
  console.log(filteredArray, "filteredArray");

  return (
    <>
      <section id="answercategory" ref={topRef}>
        <section id="category">
          <div className="row">
            <div className="col-12">
              {filteredArray && filteredArray?.length > 0 ? (
                // rendering design data based on subcategory id----------->
                <>
                  <h1 className="mb-5 fs-5 fw-bold text-center  border-bottom pb-3">
                    <span className="ms-3 heading">{catName}</span>
                  </h1>
                  {filteredArray?.map(
                    (item: SubCateMandatoryDataInfo, outerIndex: number) => (
                      <div className="cards">
                        <h3 className="card-title">{item?.sub_cat_name}</h3>
                        <div className="d-flex align-items-center">
                          <ProgressBar
                            progress={item?.answers_count}
                            maxValue={item?.question_count}
                          />
                          <span>
                            {item?.answers_count} / {item?.question_count}
                          </span>
                        </div>
                        <div className="d-flex category-card-action">
                          {currentQuestions?.map(
                            (citem: any, index: number) => (
                              <React.Fragment key={index}>
                                {citem.is_locked === 1 ? (
                                  <>
                                    {/* <div className="d-flex justify-content-center align-items-center"> */}
                                    {/* <div className="col-3 py-2 warn-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 6.49L19.53 19.5H4.47L12 6.49ZM12 2.5L1 21.5H23L12 2.5ZM13 16.5H11V18.5H13V16.5ZM13 10.5H11V14.5H13V10.5Z" fill="#A9720D" />
                                </svg>
                                <span className="ms-3 warning">Locked - unable to edit</span>
                              </div> */}

                                    <div className=" me-3 ">
                                      <img
                                        style={{ cursor: "pointer" }}
                                        className="responsive-image"
                                        src={require(`../../assets/Icons/lock.png`)}
                                        alt="lock"
                                        width={45}
                                        height={45}
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Locked - Unable to Edit"
                                        onClick={(e) => {
                                          if (role_id !== 4) {
                                            e.stopPropagation();
                                            lockFunc(isLocked, categoryId);
                                          }
                                        }}
                                      />
                                      <p>Unlock</p>
                                    </div>
                                  </>
                                ) : (
                                  <div className="me-3 text-center">
                                    <img
                                      style={{ cursor: "pointer" }}
                                      className="responsive-image"
                                      src={require(`../../assets/Icons/unLock.png`)}
                                      alt="lock"
                                      width={45}
                                      height={45}
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title=""
                                      onClick={(e) => {
                                        if (role_id !== 4) {
                                          e.stopPropagation();
                                          lockFunc(isLocked, categoryId);
                                        }
                                      }}
                                    />
                                    <p>Lock</p>
                                  </div>
                                )}
                              </React.Fragment>
                            )
                          )}
                          {totalPages === 1 ? (
                            <div
                              className="text-center category-card-action-icon"
                              style={{ cursor: "not-allowed" }}
                            >
                              <img
                                className="responsive-image"
                                src={require(`../../assets/Icons/Previous.png`)}
                                alt="edit"
                                width={45}
                                height={45}
                              />
                              <p>Previous</p>
                            </div>
                          ) : (
                            <div
                              className="text-center category-card-action-icon"
                              onClick={() => handlePreviousClick()}
                            >
                              <img
                                style={{ cursor: "pointer" }}
                                className="responsive-image"
                                src={require(`../../assets/Icons/Previous.png`)}
                                alt="edit"
                                width={45}
                                height={45}
                              />
                              <p>Previous</p>
                            </div>
                          )}

                          {totalPages === indexOfLastSubCategory ? (
                            <div
                              className="text-center"
                              style={{ cursor: "not-allowed" }}
                              // onClick={() => handleNextClick()}
                            >
                              <img
                                style={{ cursor: "not-allowed" }}
                                className="responsive-image"
                                src={require(`../../assets/Icons/next.png`)}
                                alt="edit"
                                width={45}
                                height={45}
                              />
                              <p>Next</p>
                            </div>
                          ) : (
                            <div
                              className="text-center"
                              onClick={() => handleNextClick()}
                            >
                              <img
                                style={{ cursor: "pointer" }}
                                className="responsive-image"
                                src={require(`../../assets/Icons/next.png`)}
                                alt="edit"
                                width={45}
                                height={45}
                              />
                              <p>Next</p>
                            </div>
                          )}
                          {/* {qulist[0]?.is_locked === 1 ? (
                            <div
                              className="text-center"
                              style={{ cursor: "not-allowed" }}
                            >
                              <img
                                className="responsive-image"
                                src={require(`../../assets/Icons/next.png`)}
                                alt="edit"
                                width={45}
                                height={45}
                              />
                              <p>Next</p>
                            </div>
                          ) : (
                            <div
                              className="text-center"
                              onClick={() => handleNextClick()}
                            >
                              <img
                                style={{ cursor: "pointer" }}
                                className="responsive-image"
                                src={require(`../../assets/Icons/next.png`)}
                                alt="edit"
                                width={45}
                                height={45}
                              />
                              <p>Next</p>
                            </div>
                          )} */}
                        </div>
                      </div>
                    )
                  )}
                </>
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </section>
      </section>
      {qulist && qulist?.length > 0 ? (
        <section id="Answer">
          <div className="row">
            {showToast1 === false ? (
              <AnswerCard
                qulist={qulist}
                selectAnswer={selectAnswer}
                selectedFileAnswer={selectedFileAnswer}
                setSelectAnswer={setSelectAnswer}
                setCheckselectAnswer={setCheckselectAnswer}
                setSelectedFileAnswer={setSelectedFileAnswer}
                setFileName={setFileName}
                currentQuestions={currentQuestions}
                token={token}
                file1={file1}
                click={handleNextClick}
              />
            ) : (
              <div className="position-relative">
                <SaveLoading />
                <p className="text-center Saveing "> Saving ...</p>
              </div>
            )}

            <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7 ">
              <div className="d-flex  mb-5 justify-content-center align-items-center previous-next-btn text-center">
                <div>
                  <PrimaryBtn
                    onClick={() => handlePreviousClick()}
                    style={{
                      backgroundColor:
                        "var(--Colours-Neutral-colours-White-10)",
                      color: "var(--Colours-Primary-colour-Blue-500)",
                      border:
                        "1px solid var(--Colours-Primary-colour-Blue-500)",
                    }}
                    disabled={!preSubCatName || totalPages === 1}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={
                      preSubCatName
                        ? `${preSubCatName}`
                        : "No Previous Subcategory"
                    }
                  >
                    Previous Sub category
                  </PrimaryBtn>
                </div>
                {totalPages === indexOfLastSubCategory ? (
                  <div>
                    <PrimaryBtn
                      onClick={() => handleNextClick()}
                      style={{
                        marginLeft: "1rem",
                        backgroundColor:
                          qulist[0]?.is_locked === 1
                            ? "var(--Colours-Neutral-colours-White-10)"
                            : "var(--Colours-Primary-colour-Blue-500)",
                        color:
                          qulist[0]?.is_locked === 1
                            ? "var(--Colours-Primary-colour-Blue-500)"
                            : "var(--Colours-Neutral-colours-White-10)",
                        border:
                          "1px solid var(--Colours-Primary-colour-Blue-500)",
                      }}
                      disabled={
                        qulist[0]?.is_locked === 1 || showToast1 === true
                      }
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={
                        nextSubCatName
                          ? `${nextSubCatName} `
                          : "No Next Subcategory"
                      }
                    >
                      save
                    </PrimaryBtn>
                  </div>
                ) : (
                  <div>
                    <PrimaryBtn
                      onClick={() => handleNextClick()}
                      style={{ marginLeft: "1rem" }}
                      // disabled={totalPages === indexOfLastSubCategory}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={
                        nextSubCatName
                          ? `${nextSubCatName}`
                          : "No Next Subcategory"
                      }
                    >
                      Next Sub category
                    </PrimaryBtn>
                  </div>
                )}

                {totalPages === indexOfLastSubCategory ? (
                  <>
                    <SeconderyBtn
                      onClick={() => navigate(`/Home/Summary/${solutionId}`)}
                      style={{ marginLeft: "1rem" }}
                      // disabled={totalPages === indexOfLastSubCategory}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M16.6667 9.16667H6.52504L11.1834 4.50834L10 3.33334L3.33337 10L10 16.6667L11.175 15.4917L6.52504 10.8333H16.6667V9.16667Z"
                          fill="#2A3E71"
                        />
                      </svg>
                      Summary Page
                    </SeconderyBtn>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {showToast1 && (
            <Toast messages={otherRoleMessage1} onClose={() => close()} />
          )}
          {showToastLock && (
            <Toast
              messages={lockMessage}
              onClose={() => setShowToastLock(false)}
            />
          )}
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Answer;
