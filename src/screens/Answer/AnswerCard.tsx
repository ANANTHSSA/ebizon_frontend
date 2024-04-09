import React, { useEffect, useRef, useState } from "react";
import "../../styles/Answer.scss";
import MyTextarea from "../../common/MyTextarea";
import MultiSelect from "../../common/MultiSelect";
import RadioBtn from "../../common/RadioBtn";
import UploadBtn from "../../common/UploadBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import axios from "axios";
import { clearLine } from "readline";
import UseFetch from "../../utills/UseFetch";

interface AnswerCardProps {
  qulist: any;
  selectAnswer?: any;
  selectedFileAnswer?: any;
  setSelectAnswer?: any;
  setCheckselectAnswer?: any;
  setSelectedFileAnswer?: any;
  setFileName?: any;
  currentQuestions?: any;
  token?: any;
  file1?: boolean;
  mandatoryError?: any;
  setMandatoryError?: any;
  click?: any;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  qulist,
  selectAnswer = {},
  selectedFileAnswer = {},
  setSelectAnswer = () => { },
  setCheckselectAnswer = () => { },
  setSelectedFileAnswer = () => { },
  setFileName = () => { },
  currentQuestions = () => { },
  token,
  file1,
  mandatoryError,
  setMandatoryError,
  click
}) => {

  console.log(selectAnswer);
  

  const [isOpen, setIsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [alertError, setAlertError] = useState<Record<string, any>>({});
  // function to handle answer selection--------->



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

  const handleAnswerSelection = async (
    questionId: any,
    answer: any,
    questionType: any,
    possible_answer_id: any,
    sno: any
  ) => {
    console.log("questionType", questionType);
    console.log(answer);
    console.log(possible_answer_id);
    console.log(sno);
    
    
    
    if (
      questionType === "Free Text" ||
      questionType === "Radio Button" ||
      questionType === "Date" ||
      questionType === "Dropdown"
    ) {
      setSelectAnswer((prevSelectAnswer: any) => {
        const updatedSelectAnswer = {
          ...prevSelectAnswer,
          [questionId]: answer,
        };
      
        // Perform operations with the updated state here
        console.log(updatedSelectAnswer);
      
        // Now you can safely use the updatedSelectAnswer object here
      
        let userAnswer;
        let inputDateString;
        let utcDate;
      
        console.log("answer.ans_id", answer.ans_id);
        console.log(updatedSelectAnswer[questionId]);
        console.log(selectAnswer[questionId]);
        
      
        if (selectAnswer[questionId] == null || selectAnswer[questionId] == undefined) {
          console.log("answer.ans_id", answer.ans_id);
          console.log(updatedSelectAnswer[questionId]);
          
          userAnswer = JSON.stringify(updatedSelectAnswer[questionId]);
          inputDateString = new Date().toISOString();
          utcDate = inputDateString.slice(0, 19).replace("T", " ");
          const postpayload = {
            question_id: questionId,
            user_answers: userAnswer,
            Remarks: "",
            created_by: 1,
            created_on: utcDate,
            is_active: true,
          };
          insertApiCall(postpayload);
        } else {
          console.log("answer.ans_id", answer.ans_id);
          if(updatedSelectAnswer[questionId] == null || updatedSelectAnswer[questionId] == undefined){
           return 
          }
      
          userAnswer = JSON.stringify(updatedSelectAnswer[questionId]);
          inputDateString = new Date().toISOString();
          utcDate = inputDateString.slice(0, 19).replace("T", " ");
          console.log(questionId, userAnswer, utcDate);
      
          const putpayload = {
            question_id: questionId,
            user_answers: JSON.parse(userAnswer),
            Remarks: "",
            updated_by: 1,
            updated_on: utcDate,
            is_active: true,
          };
          updateApiCall(putpayload, questionId);
        }
      
        return updatedSelectAnswer;
      });
      
        //   if (prevSelectAnswer[questionId] === undefined) {
        //     console.log("answer.ans_id", answer.ans_id);
            
        //     // Insert operation
        //     userAnswer = JSON.stringify(selectAnswer[questionId]);
        //     inputDateString = new Date().toISOString();
        //     utcDate = inputDateString.slice(0, 19).replace("T", " ");
        //     const postpayload = {
        //      question_id: questionId,
        //      user_answers: userAnswer,
        //      Remarks: "",
        //      created_by: 1,
        //      created_on: utcDate,
        //      is_active: true,
        //    };
        //   //  await insertApiCall(postpayload)
        //     insertApiCall(postpayload, questionId);
        //   } else {
        //     // Update operation
        //     console.log("answer.ans_id", answer.ans_id);
            
        //     userAnswer = JSON.stringify(selectAnswer[questionId]);
        //         inputDateString = new Date().toISOString();
        //         utcDate = inputDateString.slice(0, 19).replace("T", " ");
        //         console.log(questionId, userAnswer, utcDate);
                
        //         const putpayload = {
        //           question_id: questionId,
        //           user_answers: JSON.parse(userAnswer),
        //           Remarks: "",
        //           updated_by: 1,
        //           updated_on: utcDate,
        //           is_active: true,
        //         };
        //     updateApiCall(putpayload, questionId);
        //   }
    
        //   return updatedSelectAnswer;
        // });
      
    
    }
    if (questionType === "Dropdown") {
      handleToggleDropdown();
    } else if (questionType === "Multi Select") {
      if (selectAnswer[questionId]) {
        const isAnswerSelected = selectAnswer[questionId]?.some(
          (selectedAnswer: any) => selectedAnswer.ans_id === possible_answer_id
        );

        if (isAnswerSelected) {
          const updatedAnswers = selectAnswer[questionId]?.filter(
            (selectedAnswer: any) =>
              selectedAnswer.ans_id !== possible_answer_id
          );

          setSelectAnswer({
            ...selectAnswer,
            [questionId]: updatedAnswers,
          });
        } else {
          setSelectAnswer({
            ...selectAnswer,
            [questionId]: [
              ...selectAnswer[questionId],
              {
                answers: answer,
                ans_id: possible_answer_id,
              },
            ],
          });
        }
      } else {
        setSelectAnswer({
          ...selectAnswer,
          [questionId]: [
            {
              answers: answer,
              ans_id: possible_answer_id,
            },
          ],
        });
      }
    } else if (questionType === "file") {
      const fileName = answer.name;
      console.log("fileName", fileName);
      setFileName(answer);
      setSelectedFileName(fileName);
      setSelectAnswer({
        ...selectAnswer,
        [questionId]: [
          {
            answers: fileName,
          },
        ],
      });
      setSelectedFileAnswer({
        ...selectedFileAnswer,
        [questionId]: [
          {
            answers: fileName,
          },
        ],
      });
    }
  };
  useEffect(() => {
    setSelectAnswer((prevSelectAnswer: any) => {
      const updatedSelectAnswer = { ...prevSelectAnswer };

      qulist?.forEach((question: any) => {
        const { question_id, question_type, answers, user_answers } = question;

        if (question_type === "Multi Select") {
          if (user_answers && user_answers.length > 0) {
            const questionAnswers: any[] = [];
            user_answers.forEach((userAnswer: any) => {
              const { ans_id, answer } = userAnswer;

              if (Array.isArray(answer) && answer.length > 0) {
                answer.forEach((ansObj) => {
                  const updatedEntry = {
                    ans_id: ansObj?.ans_id || null,
                    answers: ansObj?.answers || null,
                  };

                  const entryExists = questionAnswers.some(
                    (entry) => entry.ans_id === updatedEntry.ans_id
                  );

                  if (!entryExists) {
                    questionAnswers.push(updatedEntry);
                  }
                });
              } else if (typeof answer === "string") {
                const updatedEntry = {
                  ans_id: ans_id || null,
                  answers: answer || null,
                };

                const entryExists = questionAnswers.some(
                  (entry) => entry.ans_id === updatedEntry.ans_id
                );

                if (!entryExists) {
                  questionAnswers.push(updatedEntry);
                }
              }
            });

            updatedSelectAnswer[question_id] = questionAnswers;
          } else {
            const possible_answer_id = answers?.[0]?.possible_answer_id;
            const updatedEntry = {
              ans_id: possible_answer_id || null,
              answers: answers || null,
            };

            updatedSelectAnswer[question_id] = [updatedEntry];
          }
        } else if (
          question_type === "Free Text" ||
          question_type === "Date" ||
          question_type === "Dropdown" ||
          question_type === "Radio Button" ||
          question_type === "file"
        ) {
          updatedSelectAnswer[question_id] = user_answers?.[0]?.answer;
        }
      });

      return updatedSelectAnswer;
    });
    setCheckselectAnswer((prevSelectAnswer: any) => {
      const updatedSelectAnswer = { ...prevSelectAnswer };

      qulist?.forEach((question: any) => {
        const { question_id, question_type, answers, user_answers } = question;

        if (question_type === "Multi Select") {
          if (user_answers && user_answers.length > 0) {
            const questionAnswers: any[] = [];
            user_answers.forEach((userAnswer: any) => {
              const { ans_id, answer } = userAnswer;

              if (Array.isArray(answer) && answer.length > 0) {
                answer.forEach((ansObj) => {
                  const updatedEntry = {
                    ans_id: ansObj?.ans_id || null,
                    answers: ansObj?.answers || null,
                  };

                  const entryExists = questionAnswers.some(
                    (entry) => entry.ans_id === updatedEntry.ans_id
                  );

                  if (!entryExists) {
                    questionAnswers.push(updatedEntry);
                  }
                });
              } else if (typeof answer === "string") {
                const updatedEntry = {
                  ans_id: ans_id || null,
                  answers: answer || null,
                };

                const entryExists = questionAnswers.some(
                  (entry) => entry.ans_id === updatedEntry.ans_id
                );

                if (!entryExists) {
                  questionAnswers.push(updatedEntry);
                }
              }
            });

            updatedSelectAnswer[question_id] = questionAnswers;
          } else {
            const possible_answer_id = answers?.[0]?.possible_answer_id;
            const updatedEntry = {
              ans_id: possible_answer_id || null,
              answers: answers || null,
            };

            updatedSelectAnswer[question_id] = [updatedEntry];
          }
        } else if (
          question_type === "Free Text" ||
          question_type === "Date" ||
          question_type === "Dropdown" ||
          question_type === "Radio Button" ||
          question_type === "file"
        ) {
          updatedSelectAnswer[question_id] = user_answers?.[0]?.answer;
        }
      });

      return updatedSelectAnswer;
    });
  }, [qulist]);

  useEffect(() => {
    setAlertError((prevAlertError) => {
      const updatedMandatoryError = { ...prevAlertError };

      qulist?.forEach((question: any) => {
        const { question_id, question_type, user_answers, mandatory, sno } =
          question;

        if (mandatory === 1) {
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
            delete updatedMandatoryError[question_id];
          }
        }
      });

      return updatedMandatoryError;
    });
  }, [qulist]);


  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = async (fileName1: string) => {
    console.log("fileName", fileName1);
    if (!fileName1) {
      console.error("File name is undefined");
      return;
    }

    try {
      console.log("token", token);

      const response = await axios.get(
        `answers/attachment?filename=${fileName1}`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("response", response);
      if (response.status >= 200 && response.status < 300) {
        const contentType = response.headers['content-type'];
        const contentLength = response.headers['content-length']; // Get content length
        const fileSize = contentLength ? parseInt(contentLength, 10) : 0; // Parse content length
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log("URL", url);

        // Create an invisible link element
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName1);

        // Append the link to the body and programmatically click it
        document.body.appendChild(link);
        link.click();

        // Remove the link from the DOM after the download
        document.body.removeChild(link);
        console.log(fileSize, "bytes");
        
      } else {
        console.error("Error downloading file. Status:", response.status);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <>
      {qulist && qulist.length > 0 ? (
        <>
          <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7 ">
            <div className="answer-body">
              {currentQuestions?.map((citem: any, index: number) => (
                <React.Fragment key={index}>
                  {citem.is_locked === 1 ? (
                    <>
                      <div className="row">
                        {qulist
                          // lock question---------------->
                          // filtering questions based on question type ------------>

                          .filter((item: any) => item.question_type === "Date")
                          .map((filteredItem: any, index: number) => (
                            <></>
                            // <div className="col-xs-12 col-md-6" key={index}>
                            //     <div className="d-flex">
                                    
                            //            {/* {filteredItem?.mandatory === 1 ? (
                            //             <p
                            //                           className={`qusetion-number me-1 ${mandatoryError &&
                            //                 filteredItem &&
                            //                 mandatoryError[
                            //                 filteredItem?.question_id
                            //                 ] === `${filteredItem?.sno}`
                            //                 ? "mandatory-error"
                            //                 : ""
                            //               }`}
                            //             >  {filteredItem?.sno}</p>
                            //            ):(<></>)} */}
                            //       <>
                            //           {filteredItem?.mandatory === 1 ? (
                            //             <>
                            //               <p
                            //                 className={`qusetion-number me-1 ${mandatoryError &&
                            //                   filteredItem &&
                            //                     mandatoryError[
                            //                       filteredItem?.question_id
                            //                     ] === `${filteredItem?.sno}`
                            //                     ? "mandatory-error"
                            //                     : ""
                            //                   }`}
                            //               >
                            //                 {filteredItem.sno}
                            //               </p>
                            //               <span
                            //                 className={`me-2 ${mandatoryError &&
                            //                   filteredItem &&
                            //                     mandatoryError[
                            //                       filteredItem?.question_id
                            //                     ] === `${filteredItem?.sno}`
                            //                     ? "mandatory-error"
                            //                     : ""
                            //                   }`}
                            //               >
                            //                 .
                            //               </span>
                            //             </>
                            //           ) : (
                            //             <>
                            //               <p className="qusetion-number me-1">
                            //                 {filteredItem.sno}
                            //               </p>
                            //               <span className="me-2">.</span>
                            //             </>
                            //           )}

                            //           {filteredItem?.mandatory === 1 ? (
                            //             <>
                            //               <p
                            //                 className={`question-question ${mandatoryError &&
                            //                   filteredItem &&
                            //                     mandatoryError[
                            //                       filteredItem?.question_id
                            //                     ] === `${filteredItem?.sno}`
                            //                     ? "mandatory-error"
                            //                     : ""
                            //                   }`}
                            //               >
                            //                 {filteredItem?.question}
                            //                 <span>*</span>
                            //               </p>{" "}
                            //             </>
                            //           ) : (
                            //             <div>
                            //             <p className="qusetion-question">
                            //               {filteredItem?.question}
                            //             </p>
                            //             <div >
                            //             <input
                            //               type="date"
                            //               name={`start_date_${filteredItem?.question_id}`}

                            //               value={
                            //                 selectAnswer[
                            //                   filteredItem?.question_id
                            //                 ] ||
                            //                 (filteredItem?.user_answers &&
                            //                   filteredItem?.user_answers?.map(
                            //                     (answer: any) => answer.answer
                            //                   ))
                            //               }
                            //               disabled={true}
                            //             />
                            //           </div>
                            //             </div>
                                        
                            //           )}
                            //         </>
                            //     </div>
                            // </div>
                            // <div className="col-xs-12 col-md-6" key={index}>
                            //   {filteredItem.question === "" && (
                            //     // Start Date component disabled ------------------------->
                            //     <>
                            //       <div className="d-flex">
                            //         {filteredItem?.mandatory === 1 ? (
                            //           <p
                            //             className={`qusetion-number me-1 ${mandatoryError &&
                            //                 filteredItem &&
                            //                 mandatoryError[
                            //                 filteredItem?.question_id
                            //                 ] === `${filteredItem?.sno}`
                            //                 ? "mandatory-error"
                            //                 : ""
                            //               }`}
                            //           >
                            //             {filteredItem?.sno}
                            //           </p>
                            //         ) : (
                            //           <p className="qusetion-number me-1">
                            //             {filteredItem?.sno}
                            //           </p>
                            //         )}
                            //          <p className="qusetion-question">
                            //             {filteredItem?.question}
                            //           </p>
                            //         {/* <p className="qusetion-number me-1">
                            //           {filteredItem?.sno}
                            //         </p> */}
                            //         {filteredItem?.mandatory === 1 ? (
                            //           <span
                            //             className={`me-2 ${mandatoryError &&
                            //                 filteredItem &&
                            //                 mandatoryError[
                            //                 filteredItem?.question_id
                            //                 ] === `${filteredItem?.sno}`
                            //                 ? "mandatory-error"
                            //                 : ""
                            //               }`}
                            //           >
                            //             .
                            //           </span>
                            //         ) : (
                            //           <span className="me-2">.</span>
                            //         )}
                            //         {filteredItem?.mandatory === 1 ? (
                            //           <>
                            //             <p
                            //               className={`qusetion-question ${mandatoryError &&
                            //                   filteredItem &&
                            //                   mandatoryError[
                            //                   filteredItem?.question_id
                            //                   ] === `${filteredItem?.sno}`
                            //                   ? "mandatory-error"
                            //                   : ""
                            //                 }`}
                            //             >
                            //               {filteredItem?.question}
                            //               <span>*</span>
                            //             </p>{" "}
                            //           </>
                            //         ) : (
                            //           <p className="qusetion-question">
                            //             {filteredItem?.question}
                            //           </p>
                            //         )}
                            //       </div>
                            //       <div className="answer-section">
                            //         <input
                            //           type="date"
                            //           value={
                            //             selectAnswer[
                            //             filteredItem.question_id
                            //             ] ||
                            //             (filteredItem.user_answers &&
                            //               filteredItem.user_answers?.map(
                            //                 (answer: any) => answer.answer
                            //               ))
                            //           }
                            //           disabled={true}
                            //         ></input>
                            //       </div>
                            //     </>
                            //   )}


                            //   {filteredItem.question === "" && (
                            //     // End Date component disabled------------------------->
                            //     <>
                            //       <div className="d-flex">
                            //         {filteredItem?.mandatory === 1 ? (
                            //           <p
                            //             className={`qusetion-number me-1 ${mandatoryError &&
                            //                 filteredItem &&
                            //                 mandatoryError[
                            //                 filteredItem?.question_id
                            //                 ] === `${filteredItem?.sno}`
                            //                 ? "mandatory-error"
                            //                 : ""
                            //               }`}
                            //           >
                            //             {filteredItem?.sno}
                            //           </p>
                            //         ) : (
                            //           <p className="qusetion-number me-1">
                            //             {filteredItem?.sno}
                            //           </p>
                            //         )}
                            //         {/* <p className="qusetion-number me-1">
                            //           {filteredItem?.sno}
                            //         </p> */}
                            //         {filteredItem?.mandatory === 1 ? (
                            //           <span
                            //             className={`me-2 ${mandatoryError &&
                            //                 filteredItem &&
                            //                 mandatoryError[
                            //                 filteredItem?.question_id
                            //                 ] === `${filteredItem?.sno}`
                            //                 ? "mandatory-error"
                            //                 : ""
                            //               }`}
                            //           >
                            //             .
                            //           </span>
                            //         ) : (
                            //           <span className="me-2">.</span>
                            //         )}
                            //         {filteredItem?.mandatory === 1 ? (
                            //           <>
                            //             <p
                            //               className={`qusetion-question ${mandatoryError &&
                            //                   filteredItem &&
                            //                   mandatoryError[
                            //                   filteredItem?.question_id
                            //                   ] === `${filteredItem?.sno}`
                            //                   ? "mandatory-error"
                            //                   : ""
                            //                 }`}
                            //             >
                            //               {filteredItem?.question}
                            //               <span>*</span>
                            //             </p>{" "}
                            //           </>
                            //         ) : (
                            //           <p className="qusetion-question">
                            //             {filteredItem?.question}
                            //           </p>
                            //         )}
                            //       </div>
                            //       <div className="answer-section">
                            //         <input
                            //           type="date"
                            //           value={
                            //             selectAnswer[
                            //             filteredItem.question_id
                            //             ] ||
                            //             (filteredItem.user_answers &&
                            //               filteredItem.user_answers?.map(
                            //                 (answer: any) => answer.answer
                            //               ))
                            //           }
                            //           disabled={true}
                            //         ></input>
                            //       </div>
                            //     </>
                            //   )}
                            // </div>

                          )

                          )}
                      </div>
                      <>
                        {qulist?.map((item: any, index: number) =>
                          item.sno !== 0 ? (
                            <div key={index}>
                              <div className="d-flex">
                                
                                    <>
                                      {item?.mandatory === 1 ? (
                                        <>
                                          <p
                                            className={`qusetion-number me-1 ${mandatoryError &&
                                                item &&
                                                mandatoryError[
                                                item?.question_id
                                                ] === `${item?.sno}`
                                                ? "mandatory-error"
                                                : ""
                                              }`}
                                          >
                                            {item.sno}
                                          </p>
                                          <span
                                            className={`me-2 ${mandatoryError &&
                                                item &&
                                                mandatoryError[
                                                item?.question_id
                                                ] === `${item?.sno}`
                                                ? "mandatory-error"
                                                : ""
                                              }`}
                                          >
                                            .
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <p className="qusetion-number me-1">
                                            {item.sno}
                                          </p>
                                          <span className="me-2">.</span>
                                        </>
                                      )}

                                      {item?.mandatory === 1 ? (
                                        <>
                                          <p
                                            className={`question-question ${mandatoryError &&
                                                item &&
                                                mandatoryError[
                                                item?.question_id
                                                ] === `${item?.sno}`
                                                ? "mandatory-error"
                                                : ""
                                              }`}
                                          >
                                            {item?.question}
                                            <span>*</span>
                                          </p>{" "}
                                        </>
                                      ) : (
                                        <p className="qusetion-question">
                                          {item?.question}
                                        </p>
                                      )}
                                    </>
                                  
                              </div>

                              {item?.question_type === "Free Text" && (
                                // Free Text component disabled--------------------------->
                                <div className="answer-section ">
                                  <MyTextarea
                                    name={`question_${item?.question_id}`}
                                    value={selectAnswer[item.question_id] || ""}
                                    disabled={true}
                                    className="custom-textarea"
                                  />
                                </div>
                              )}
                              {item?.question_type === "Date" && (
                                 <div className="answer-section">
                                 <input
                                   type="date"
                                   name={`start_date_${item?.question_id}`}

                                   value={
                                     selectAnswer[
                                     item?.question_id
                                     ] ||
                                     (item?.user_answers &&
                                       item?.user_answers?.map(
                                         (answer: any) => answer.answer
                                       ))
                                   }
                                   disabled={true}
                                 />
                               </div>
                              )}

                              {/* {item?.question !== "Start Date" &&
                                item?.question !== "End Date" &&
                                item?.question_type === "Date" &&
                                item?.question_id && (
                                  <div className="date-row">
                                    <div className="answer-section">
                                      <div>
                                        <input
                                          type="date"
                                          name={`start_date_${item?.question_id}`}

                                          value={
                                            selectAnswer[
                                            item?.question_id
                                            ] ||
                                            (item?.user_answers &&
                                              item?.user_answers?.map(
                                                (answer: any) => answer.answer
                                              ))
                                          }
                                          disabled={true}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )} */}

                              {item?.question_type === "Multi Select" &&
                                // Multi Select component disabled--------------------------->
                                item?.question_id && (
                                  <div className="answer-section">
                                    {item?.answerlist &&
                                      item?.answerlist?.map(
                                        (
                                          answerOption: any,
                                          answerIndex: number
                                        ) => {
                                          return (
                                            <div
                                              key={answerIndex}
                                              className="col-12 multiselect-option"
                                            >
                                              <label className="custom-checkbox">
                                                <MultiSelect
                                                  type="checkbox"
                                                  name="answer"
                                                  value={
                                                    answerOption.possible_answer_id
                                                  }
                                                  disabled={true}
                                                  checked={
                                                    (
                                                      selectAnswer[
                                                      item?.question_id
                                                      ] || []
                                                    ).some(
                                                      (selectedAnswer: any) =>
                                                        selectedAnswer.ans_id ===
                                                        answerOption.possible_answer_id
                                                    ) || false
                                                  }
                                                />
                                                {answerOption?.answer}
                                              </label>
                                            </div>
                                          );
                                        }
                                      )}
                                  </div>
                                )}

                              {item?.question_type === "Dropdown" &&
                                // Dropdown component disabled------------------------->
                                item?.question_id && (
                                  <div className="answer-section">
                                    <div
                                      className={`custom-dropdown ${isOpen ? "open" : ""
                                        }`}
                                    >
                                      <div>
                                        <div
                                          style={{
                                            backgroundColor:
                                              "var(--Colours-Neutral-colours-Gray-100)",
                                            border:
                                              "1px solid var(--Colours-Typography-colours-Disabled)",
                                            cursor: "not-allowed",
                                          }}
                                          className="selected-option d-flex justify-content-between align-items-center"
                                          onClick={handleToggleDropdown}
                                        >
                                          {selectAnswer &&
                                            selectAnswer[item?.question_id]
                                            ? selectAnswer[item?.question_id]
                                            : "Select an option"}
                                          <img
                                            src={require("../../assets/Icons/dropDown.png")}
                                            width={24}
                                            height={24}
                                            alt="dropdown-icon"
                                          />
                                        </div>
                                      </div>

                                      {false && (
                                        <div className="options">
                                          {item?.answerlist?.map(
                                            (
                                              answerOption: any,
                                              answerIndex: number
                                            ) => (
                                              <div
                                                key={answerIndex}
                                                className="option"
                                                onClick={() =>
                                                  handleAnswerSelection(
                                                    item?.question_id,
                                                    answerOption?.answer,
                                                    item?.question_type,
                                                    null,
                                                    item?.sno
                                                  )
                                                }
                                              >
                                                {answerOption?.answer}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              <div className="answer-section">
                                {item?.question_type === "Radio Button" &&
                                  item?.follow_up !== null &&
                                  item?.answerlist &&
                                  item?.answerlist.map(
                                    (answerOption: any, answerIndex: any) => {
                                      const isChecked = (
                                        selectAnswer[item?.question_id] || []
                                      ).includes(answerOption.answer);
                                      let foundItem: any;

                                      return (
                                        <div>
                                          <div key={answerIndex}>
                                            <RadioBtn
                                              name={`question_${item?.question_id}`}
                                              value={answerOption?.answer}
                                              // checked={(
                                              //   selectAnswer[
                                              //     question.question_id
                                              //   ] || []
                                              // ).includes(
                                              //   answerOption.answer
                                              // )}
                                              checked={isChecked}
                                              onChange={() =>
                                                handleAnswerSelection(
                                                  item?.question_id,
                                                  answerOption.answer,
                                                  item?.question_type,
                                                  null,
                                                  item?.sno
                                                )
                                              }
                                              disabled={true}
                                            />

                                            {isChecked
                                              ? (foundItem =
                                                item?.follow_up.find(
                                                  (item1: any) =>
                                                    selectAnswer[
                                                    item?.question_id
                                                    ] === item1?.criteria
                                                )) &&
                                              currentQuestions
                                                ?.map((item1: any) =>
                                                  item1?.qalist?.find(
                                                    (qitem: any) =>
                                                      foundItem.id ===
                                                      qitem.question_id
                                                  )
                                                )
                                                ?.map(
                                                  (
                                                    question: any,
                                                    index: any
                                                  ) => (
                                                    <div key={index}>
                                                      {question?.question_type ===
                                                        "Multi Select" && (
                                                          <div className="">
                                                            {question.answerlist &&
                                                              question.answerlist?.map(
                                                                (
                                                                  answerOption: any,
                                                                  answerIndex: any
                                                                ) => (
                                                                  <div></div>
                                                                  // <div
                                                                  //   key={
                                                                  //     answerIndex
                                                                  //   }
                                                                  //   className="col-lg-6 multiselect-option"
                                                                  // >
                                                                  //   <label className="custom-checkbox">
                                                                  //     <CheckboxComponent
                                                                  //       type="checkbox"
                                                                  //       name={`question_${question.question_id}`}
                                                                  //       value={
                                                                  //         answerOption.possible_answer_id
                                                                  //       }
                                                                  //       onChange={() =>
                                                                  //         handleAnswerSelection(
                                                                  //           question.question_id,
                                                                  //           answerOption.answer,
                                                                  //           question.question_type,
                                                                  //           answerOption.possible_answer_id,
                                                                  //           question.sno
                                                                  //         )
                                                                  //       }
                                                                  //       checked={
                                                                  //         (
                                                                  //           selectAnswer[
                                                                  //             question
                                                                  //               .question_id
                                                                  //           ] ||
                                                                  //           []
                                                                  //         ).some(
                                                                  //           (
                                                                  //             selectedAnswer
                                                                  //           ) =>
                                                                  //             selectedAnswer.ans_id ===
                                                                  //             answerOption.possible_answer_id
                                                                  //         ) ||
                                                                  //         false
                                                                  //       }
                                                                  //     />
                                                                  //     {
                                                                  //       answerOption.answer
                                                                  //     }
                                                                  //   </label>
                                                                  // </div>
                                                                )
                                                              )}
                                                          </div>
                                                        )}



                                                      {question?.question_type ===
                                                        "Free Text" && (
                                                          <MyTextarea
                                                            className="custom-textarea"
                                                            name={`question_${question.question_id}`}
                                                            value={
                                                              selectAnswer[
                                                              question
                                                                .question_id
                                                              ] ||
                                                              (question.user_answers &&
                                                                question.user_answers?.map(
                                                                  (
                                                                    answer: any
                                                                  ) =>
                                                                    answer.answer
                                                                ))
                                                            }
                                                            onBlur={(e) =>
                                                              handleAnswerSelection(
                                                                question.question_id,
                                                                e.target.value,
                                                                question.question_type,
                                                                null,
                                                                question.sno
                                                              )
                                                            }
                                                            disabled={true}
                                                          />
                                                        )}

                                                      {question?.question_type ===
                                                        "Radio Button" &&
                                                        question?.follow_up != null &&
                                                        question.question_id &&
                                                        question.answerlist?.map(
                                                          (
                                                            answerOption: any,
                                                            answerIndex: any
                                                          ) => {
                                                            const isChecked =
                                                              question.user_answers?.some(
                                                                (
                                                                  userAnswer: any
                                                                ) =>
                                                                  userAnswer.answer ===
                                                                  answerOption.answer
                                                              );
                                                            return (
                                                              <div
                                                                key={
                                                                  answerIndex
                                                                }
                                                                className=" multiselect-option"
                                                              >
                                                                <RadioBtn
                                                                  name={`question_${question.question_id}`}
                                                                  value={
                                                                    answerOption?.answer
                                                                  }
                                                                  checked={
                                                                    isChecked ||
                                                                    (
                                                                      selectAnswer[
                                                                      question
                                                                        .question_id
                                                                      ] || []
                                                                    ).includes(
                                                                      answerOption.answer
                                                                    )
                                                                  }
                                                                  onChange={() =>
                                                                    handleAnswerSelection(
                                                                      question.question_id,
                                                                      answerOption.answer,
                                                                      question.question_type,
                                                                      null,
                                                                      question.sno
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                    </div>
                                                  )
                                                )
                                              : ""}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                              {item?.question_type === "Radio Button" &&
                                // Radio Button component disabled------------------------->
                                item?.follow_up == null &&
                                item?.question_id && (
                                  <div className="answer-section">
                                    {item?.answerlist?.map(
                                      (
                                        answerOption: any,
                                        answerIndex: number
                                      ) => {
                                        const isChecked =
                                          item?.user_answers?.some(
                                            (userAnswer: any) =>
                                              userAnswer?.answer ===
                                              answerOption?.answer
                                          );
                                        return (
                                          <div
                                            key={answerIndex}
                                            className="col-12 d-flex align-items-center multiselect-option"
                                          >
                                            <RadioBtn
                                              name={`question_${item?.question_id}`}
                                              value={answerOption?.answer}
                                              checked={
                                                isChecked ||
                                                (
                                                  selectAnswer[
                                                  item?.question_id
                                                  ] || []
                                                ).includes(answerOption.answer)
                                              }
                                              disabled={true}
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}

                              {item?.question_type == "file" && (
                                // File component disabled------------------------->
                                <>
                                  <div className="answer-section">
                                    <PrimaryBtn
                                      style={{
                                        backgroundColor:
                                          "var(--Colours-Primary-colour-Blue-500)",
                                        color:
                                          "var(--Colours-Neutral-colours-White-10)",
                                        border:
                                          "1px solid var(--Colours-Primary-colour-Blue-500)",
                                      }}
                                      onClick={handleFileInputClick}
                                      disabled={true}
                                      title=""
                                    >
                                      {/* <img
                                          src={require("../../assets/Icons/Style=Outlined (3).png")}
                                          width={24}
                                          height={24}
                                          style={{ marginRight: "10px", color: "var(--Colours-Primary-colour-Blue-500)" }}
                                          alt="upload"
                                        /> */}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="2em"
                                        height="1.5em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          fill-rule="evenodd"
                                          d="M10.738 16.627a1.492 1.492 0 0 1-1.487-1.362a37.117 37.117 0 0 1-.107-4.845a35.68 35.68 0 0 1-.253-.018l-1.49-.108a1.26 1.26 0 0 1-.97-1.935c1.097-1.716 3.106-3.636 4.76-4.824a1.388 1.388 0 0 1 1.619 0c1.653 1.188 3.662 3.108 4.759 4.824a1.26 1.26 0 0 1-.97 1.935l-1.49.108l-.253.018c.07 1.616.034 3.234-.107 4.845a1.492 1.492 0 0 1-1.487 1.362zm-.056-6.865a35.624 35.624 0 0 0 .063 5.365h2.51c.156-1.784.177-3.577.064-5.365a.75.75 0 0 1 .711-.796c.324-.016.647-.036.97-.06l1.081-.078a14.556 14.556 0 0 0-3.55-3.646L12 4.801l-.531.381a14.555 14.555 0 0 0-3.55 3.646L9 8.907c.323.023.647.043.97.059a.75.75 0 0 1 .711.796"
                                          clip-rule="evenodd"
                                        />
                                        <path
                                          fill="currentColor"
                                          d="M5.75 17a.75.75 0 0 0-1.5 0v2c0 .966.784 1.75 1.75 1.75h12A1.75 1.75 0 0 0 19.75 19v-2a.75.75 0 0 0-1.5 0v2a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25z"
                                        />
                                      </svg>
                                      Upload
                                    </PrimaryBtn>
                                    <input
                                      type="file"
                                      id="fileInput"
                                      className="ca-file"
                                      ref={fileInputRef}
                                      onChange={(e) =>
                                        handleAnswerSelection(
                                          item?.question_id,
                                          e.target.files?.[0],
                                          item?.question_type,
                                          null,
                                          item?.sno
                                        )
                                      }
                                      style={{ display: "none" }}
                                    />
                                    <p className="mt-2">
                                      <a
                                        style={{
                                          color:
                                            "var(--Colours-Primary-colour-Blue-500)",
                                        }}
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDownload(
                                            item?.user_answers[0]?.answer[0]
                                              ?.answers || ""
                                          );
                                        }}
                                      >
                                        {item?.user_answers &&
                                          item.user_answers[0]?.answer &&
                                          item.user_answers[0].answer[0]?.answers
                                          ? item.user_answers[0].answer[0]
                                            .answers
                                          : ""}
                                        <img
                                          src={require("../../assets/Icons/arrow_outward.png")}
                                        />
                                      </a>
                                    </p>
                                  </div>
                                </>
                              )}
                              {item?.question_type &&
                                // Link component disabled------------------------->
                                item?.question_id &&
                                item?.question_type.startsWith("{") ? (
                                JSON.parse(item?.question_type).Link ===
                                  "link" ? (
                                  <div className="answer-section">
                                    <a
                                      style={{
                                        textDecoration: "underline",
                                        cursor: "not-allowed",
                                        color:
                                          "var(--Colours-Neutral-colours-Gray-300)",
                                      }}
                                    >
                                      {JSON.parse(item?.question_type).name}
                                      <img
                                        src={require("../../assets/Icons/arrow_outward.png")}
                                        style={{ marginLeft: "7px" }}
                                      />
                                    </a>
                                  </div>
                                ) : (
                                  item?.question_type.name
                                )
                              ) : (
                                <></>
                              )}
                            </div>
                          ) : null
                        )}
                      </>
                    </>
                  ) : (
                    // unLock component ------------------------->
                    <>
                      <div className="row">
                        {qulist

                          // filtering questions based on question type ------------>

                          .filter((item: any) => item.question_type === "Date")
                          .map((filteredItem: any, index: number) => (
                            filteredItem.question == "Start Date"  &&  filteredItem.question == "End Date"  ? (
                              // Start Date component ------------------------->
                              <>
                            <div className="col-xs-12 col-md-6" key={index}>
                                  <div className="d-flex">
                                    {filteredItem?.mandatory === 1 ? (
                                      <p
                                        className={`qusetion-number me-1 ${mandatoryError &&
                                            filteredItem &&
                                            mandatoryError[
                                            filteredItem?.question_id
                                            ] === `${filteredItem?.sno}`
                                            ? "mandatory-error"
                                            : ""
                                          }`}
                                      >
                                        {filteredItem?.sno}
                                      </p>
                                    ) : (
                                      <p className="qusetion-number me-1">
                                        {filteredItem?.sno}
                                      </p>
                                    )}
                                    {/* <p className="qusetion-number me-1">
                                      {filteredItem?.sno}
                                    </p> */}
                                    {filteredItem?.mandatory === 1 ? (
                                      <span
                                        className={`me-2 ${mandatoryError &&
                                            filteredItem &&
                                            mandatoryError[
                                            filteredItem?.question_id
                                            ] === `${filteredItem?.sno}`
                                            ? "mandatory-error"
                                            : ""
                                          }`}
                                      >
                                        .
                                      </span>
                                    ) : (
                                      <span className="me-2">.</span>
                                    )}
                                    {filteredItem?.mandatory === 1 ? (
                                      <>
                                        <p
                                          className={`qusetion-question ${mandatoryError &&
                                              filteredItem &&
                                              mandatoryError[
                                              filteredItem?.question_id
                                              ] === `${filteredItem?.sno}`
                                              ? "mandatory-error"
                                              : ""
                                            }`}
                                        >
                                          {filteredItem?.question}
                                          <span>*</span>
                                        </p>{" "}
                                      </>
                                    ) : (
                                      <p className="qusetion-question">
                                        {filteredItem?.question}
                                      </p>
                                    )}
                                  </div>
                                  <div className="answer-section">
                                    <input
                                      type="date"
                                      value={
                                        selectAnswer[
                                        filteredItem.question_id
                                        ] ||
                                        (filteredItem.user_answers &&
                                          filteredItem.user_answers?.map(
                                            (answer: any) => answer.answer
                                          ))
                                      }
                                      onChange={(e) =>
                                        handleAnswerSelection(
                                          filteredItem.question_id,
                                          e.target.value,
                                          filteredItem.question_type,
                                          null,
                                          filteredItem.sno
                                        )
                                      }
                                    ></input>
                                  </div>
                                
                              {/* {filteredItem.question === "End Date" && (
                                // End Date component ------------------------->
                                <>
                                  <div className="d-flex">
                                    {filteredItem?.mandatory === 1 ? (
                                      <p
                                        className={`qusetion-number me-1 ${mandatoryError &&
                                            filteredItem &&
                                            mandatoryError[
                                            filteredItem?.question_id
                                            ] === `${filteredItem?.sno}`
                                            ? "mandatory-error"
                                            : ""
                                          }`}
                                      >
                                        {filteredItem?.sno}
                                      </p>
                                    ) : (
                                      <p className="qusetion-number me-1">
                                        {filteredItem?.sno}
                                      </p>
                                    )}
                                    //  <p className="qusetion-number me-1">
                                    //   {filteredItem?.sno}
                                    // </p> 
                                    {filteredItem?.mandatory === 1 ? (
                                      <span
                                        className={`me-2 ${mandatoryError &&
                                            filteredItem &&
                                            mandatoryError[
                                            filteredItem?.question_id
                                            ] === `${filteredItem?.sno}`
                                            ? "mandatory-error"
                                            : ""
                                          }`}
                                      >
                                        .
                                      </span>
                                    ) : (
                                      <span className="me-2">.</span>
                                    )}
                                    {filteredItem?.mandatory === 1 ? (
                                      <>
                                        <p
                                          className={`qusetion-question ${mandatoryError &&
                                              filteredItem &&
                                              mandatoryError[
                                              filteredItem?.question_id
                                              ] === `${filteredItem?.sno}`
                                              ? "mandatory-error"
                                              : ""
                                            }`}
                                        >
                                          {filteredItem?.question}
                                          <span>*</span>
                                        </p>{" "}
                                      </>
                                    ) : (
                                      <p className="qusetion-question">
                                        {filteredItem?.question}
                                      </p>
                                    )}
                                  </div>
                                  <div className="answer-section">
                                    <input
                                      type="date"
                                      value={
                                        selectAnswer[
                                        filteredItem.question_id
                                        ] ||
                                        (filteredItem.user_answers &&
                                          filteredItem.user_answers?.map(
                                            (answer: any) => answer.answer
                                          ))
                                      }
                                      onChange={(e) =>
                                        handleAnswerSelection(
                                          filteredItem.question_id,
                                          e.target.value,
                                          filteredItem.question_type,
                                          null,
                                          filteredItem.sno
                                        )
                                      }
                                    ></input>
                                  </div>
                                </>
                              )} */}
                            </div>
                            </>
                              ):(''
                              )
                          ))}
                      </div>
                      <>
                        {qulist?.map((item: any, index: number) =>
                          item.sno !== 0 ? (
                            <>
                              <div key={index}>
                                <div className="d-flex">
                                
                                      <>
                                        {item?.mandatory === 1 ? (
                                          <>
                                            <p
                                              className={`qusetion-number me-1 ${mandatoryError &&
                                                  item &&
                                                  mandatoryError[
                                                  item?.question_id
                                                  ] === `${item?.sno}`
                                                  ? "mandatory-error"
                                                  : ""
                                                }`}
                                            >
                                              {item.sno}
                                            </p>
                                            <span
                                              className={`me-2 ${mandatoryError &&
                                                  item &&
                                                  mandatoryError[
                                                  item?.question_id
                                                  ] === `${item?.sno}`
                                                  ? "mandatory-error"
                                                  : ""
                                                }`}
                                            >
                                              .
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <p className="qusetion-number me-1">
                                              {item.sno}
                                            </p>
                                            <span className="me-2">.</span>
                                          </>
                                        )}

                                        {item?.mandatory === 1 ? (
                                          <>
                                            <p
                                              className={`question-question ${mandatoryError &&
                                                  item &&
                                                  mandatoryError[
                                                  item?.question_id
                                                  ] === `${item?.sno}`
                                                  ? "mandatory-error"
                                                  : ""
                                                }`}
                                            >
                                              {item?.question}
                                              <span>*</span>
                                            </p>{" "}
                                          </>
                                        ) : (
                                          <p className="qusetion-question">
                                            {item?.question}
                                          </p>
                                        )}
                                      </>
                                    
                                </div>

                                {/* <div className="date-row">
                                    {item.question === "Start Date" &&
                                      item.question_type === "Date" &&
                                      item.question_id && (
                                        <div className="answer-section">
                                          <div>
                                            <MyTextarea
                                              // type="date"
                                              name={`start_date_${item?.question_id}`}
                                              style={{
                                                width: "100%",
                                              }}
                                              value={
                                                selectAnswer[
                                                  item?.question_id
                                                ] ||
                                                (item?.user_answers &&
                                                  item?.user_answers?.map(
                                                    (answer:any) => answer.answer
                                                  ))
                                              }
                                              onChange={(e) =>
                                                handleAnswerSelection(
                                                  item?.question_id,
                                                  e.target.value,
                                                  item?.question_type,
                                                  null,
                                                  item?.sno
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      )}

                                    {item?.question === "End Date" &&
                                      item?.question_type === "Date" &&
                                      item?.question_id && (
                                        <div className="end-date">
                                          <div className="answer-section">
                                            <MyTextarea
                                              // type="date"
                                              name={`end_date_${item?.question_id}`}
                                              style={{
                                                width: "100%",
                                              }}
                                              value={
                                                selectAnswer[
                                                  item?.question_id
                                                ] ||
                                                (item?.user_answers &&
                                                  item?.user_answers?.map(
                                                    (answer:any) => answer.answer
                                                  ))
                                              }
                                              onChange={(e) =>
                                                handleAnswerSelection(
                                                  item?.question_id,
                                                  e.target.value,
                                                  item?.question_type,
                                                  null,
                                                  item?.sno
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      )}
                                  </div> */}

                                {/* {item?.question !== "Start Date" &&
                                  item?.question !== "End Date" &&
                                  item?.question_type === "Date" &&
                                  item?.question_id && (
                                    <div className="date-row">
                                      <div className="answer-section">
                                        <div>
                                          <input
                                            type="date"
                                            name={`start_date_${item?.question_id}`}
                                            value={
                                              selectAnswer[
                                              item?.question_id
                                              ] ||
                                              (item?.user_answers &&
                                                item?.user_answers?.map(
                                                  (answer: any) => answer.answer
                                                ))
                                            }
                                            onChange={(e) =>
                                              handleAnswerSelection(
                                                item?.question_id,
                                                e.target.value,
                                                item?.question_type,
                                                null,
                                                item?.sno
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )} */}
                                  {item?.question_type === "Date" &&(
                                    <div className="answer-section">
                                    <input
                                      type="date"
                                      name={`start_date_${item?.question_id}`}
                                      value={
                                        selectAnswer[
                                        item?.question_id
                                        ] ||
                                        (item?.user_answers &&
                                          item?.user_answers?.map(
                                            (answer: any) => answer.answer
                                          ))
                                      }
                                      onChange={(e) =>
                                        handleAnswerSelection(
                                          item?.question_id,
                                          e.target.value,
                                          item?.question_type,
                                          null,
                                          item?.sno
                                        )
                                      }
                                    />
                                  </div>
                                  )}

                                {item?.question_type === "Free Text" && (
                                  // Free Text component --------------------------->
                                  <div className="answer-section ">
                                    <MyTextarea
                                      name={`question_${item?.question_id}`}
                                      // value={
                                      //   selectAnswer[item.question_id] || ""
                                      // }
                                      onBlur={(e: any) =>
                                        handleAnswerSelection(
                                          item?.question_id,
                                          e.target.value,
                                          item?.question_type,
                                          null,
                                          item?.sno
                                        )
                                      }
                                      className="custom-textarea"
                                    />
                                  </div>
                                )}

                                {item?.question_type === "Multi Select" &&
                                  // Multi Select component --------------------------->
                                  item?.question_id && (
                                    <div className="answer-section">
                                      {item?.answerlist &&
                                        item?.answerlist?.map(
                                          (
                                            answerOption: any,
                                            answerIndex: number
                                          ) => {
                                            return (
                                              <div
                                                key={answerIndex}
                                                className="col-12 multiselect-option"
                                              >
                                                <label className="custom-checkbox">
                                                  <MultiSelect
                                                    type="checkbox"
                                                    name="answer"
                                                    value={
                                                      answerOption.possible_answer_id
                                                    }
                                                    onChange={() =>
                                                      handleAnswerSelection(
                                                        item?.question_id,
                                                        answerOption?.answer,
                                                        item?.question_type,
                                                        answerOption.possible_answer_id,
                                                        item?.sno
                                                      )
                                                    }
                                                    checked={
                                                      (
                                                        selectAnswer[
                                                        item?.question_id
                                                        ] || []
                                                      ).some(
                                                        (selectedAnswer: any) =>
                                                          selectedAnswer.ans_id ===
                                                          answerOption.possible_answer_id
                                                      ) || false
                                                    }
                                                  />
                                                  {answerOption?.answer}
                                                </label>
                                              </div>
                                            );
                                          }
                                        )}
                                    </div>
                                  )}

                                {item?.question_type === "Dropdown" &&
                                  // Dropdown component ------------------------->
                                  item?.question_id && (
                                    <div className="answer-section">
                                      <div
                                        className={`custom-dropdown ${isOpen ? "open" : ""
                                          }`}
                                      >
                                        <div>
                                          <div
                                            className="selected-option d-flex justify-content-between align-items-center"
                                            onClick={handleToggleDropdown}
                                          >
                                            {selectAnswer &&
                                              selectAnswer[item?.question_id]
                                              ? selectAnswer[item?.question_id]
                                              : "Select an option"}
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
                                            {item?.answerlist?.map(
                                              (
                                                answerOption: any,
                                                answerIndex: number
                                              ) => (
                                                <div
                                                  key={answerIndex}
                                                  className="option"
                                                  onClick={() =>
                                                    handleAnswerSelection(
                                                      item?.question_id,
                                                      answerOption?.answer,
                                                      item?.question_type,
                                                      null,
                                                      item?.sno
                                                    )
                                                  }
                                                >
                                                  {answerOption?.answer}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* {item?.question_type === "Radio Button" &&
                                // Radio Button component --------------------------->
                                item?.question_id && (
                                  <div className="answer-section">
                                    {item?.answerlist?.map(
                                      (
                                        answerOption: any,
                                        answerIndex: number
                                      ) => {
                                        const isChecked =
                                          item?.user_answers?.some(
                                            (userAnswer: any) =>
                                              userAnswer?.answer ===
                                              answerOption?.answer
                                          );
                                        return (
                                          <div
                                            key={answerIndex}
                                            className="col-12 d-flex align-items-center multiselect-option"
                                          >
                                            <RadioBtn
                                              name={`question_${item?.question_id}`}
                                              value={answerOption?.answer}
                                              checked={
                                                isChecked ||
                                                (
                                                  selectAnswer[
                                                  item?.question_id
                                                  ] || []
                                                ).includes(answerOption.answer)
                                              }
                                              onChange={() =>
                                                handleAnswerSelection(
                                                  item?.question_id,
                                                  answerOption.answer,
                                                  item?.question_type,
                                                  null,
                                                  item?.sno
                                                )
                                              }
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )} */}

                                <div className="answer-section">
                                  {item?.question_type === "Radio Button" &&
                                    item?.follow_up === null &&
                                    item?.question_id &&
                                    item?.answerlist &&
                                    item?.answerlist?.map(
                                      (answerOption: any, answerIndex: any) => {
                                        const isChecked = (
                                          selectAnswer[item?.question_id] || []
                                        ).includes(answerOption.answer);
                                        
                                        return (
                                          <div key={answerIndex} className="">
                                            <RadioBtn
                                              name={`question_${item?.question_id}`}
                                              value={answerOption?.answer}
                                              checked={
                                                isChecked
                                              }
                                              onChange={() =>
                                                handleAnswerSelection(
                                                  item?.question_id,
                                                  answerOption.answer,
                                                  item?.question_type,
                                                  null,
                                                  item?.sno
                                                )
                                              }
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                </div>

                                <div className="answer-section">
                                  {item?.question_type === "Radio Button" &&
                                    item?.follow_up !== null &&
                                    item?.answerlist &&
                                    item?.answerlist.map(
                                      (answerOption: any, answerIndex: any) => {
                                        const isChecked = (
                                          selectAnswer[item?.question_id] || []
                                        ).includes(answerOption.answer);
                                        let foundItem: any;

                                        return (
                                          <div>
                                            <div key={answerIndex}>
                                              <RadioBtn
                                                name={`question_${item?.question_id}`}
                                                value={answerOption?.answer}
                                                // checked={(
                                                //   selectAnswer[
                                                //     question.question_id
                                                //   ] || []
                                                // ).includes(
                                                //   answerOption.answer
                                                // )}
                                                checked={isChecked}
                                                onChange={() =>
                                                  handleAnswerSelection(
                                                    item?.question_id,
                                                    answerOption.answer,
                                                    item?.question_type,
                                                    null,
                                                    item?.sno
                                                  )
                                                }
                                              />

                                              {isChecked
                                                ? (foundItem =
                                                  item?.follow_up.find(
                                                    (item1: any) =>
                                                      selectAnswer[
                                                      item?.question_id
                                                      ] === item1?.criteria
                                                  )) &&
                                                currentQuestions
                                                  ?.map((item1: any) =>
                                                    item1?.qalist?.find(
                                                      (qitem: any) =>
                                                        foundItem.id ===
                                                        qitem.question_id
                                                    )
                                                  )
                                                  ?.map(
                                                    (
                                                      question: any,
                                                      index: any
                                                    ) => (
                                                      <div key={index}>
                                                        {question?.question_type ===
                                                          "Multi Select" && (
                                                            <div className="">
                                                              {question.answerlist &&
                                                                question.answerlist?.map(
                                                                  (
                                                                    answerOption: any,
                                                                    answerIndex: any
                                                                  ) => (
                                                                    <div></div>
                                                                    // <div
                                                                    //   key={
                                                                    //     answerIndex
                                                                    //   }
                                                                    //   className="col-lg-6 multiselect-option"
                                                                    // >
                                                                    //   <label className="custom-checkbox">
                                                                    //     <CheckboxComponent
                                                                    //       type="checkbox"
                                                                    //       name={`question_${question.question_id}`}
                                                                    //       value={
                                                                    //         answerOption.possible_answer_id
                                                                    //       }
                                                                    //       onChange={() =>
                                                                    //         handleAnswerSelection(
                                                                    //           question.question_id,
                                                                    //           answerOption.answer,
                                                                    //           question.question_type,
                                                                    //           answerOption.possible_answer_id,
                                                                    //           question.sno
                                                                    //         )
                                                                    //       }
                                                                    //       checked={
                                                                    //         (
                                                                    //           selectAnswer[
                                                                    //             question
                                                                    //               .question_id
                                                                    //           ] ||
                                                                    //           []
                                                                    //         ).some(
                                                                    //           (
                                                                    //             selectedAnswer
                                                                    //           ) =>
                                                                    //             selectedAnswer.ans_id ===
                                                                    //             answerOption.possible_answer_id
                                                                    //         ) ||
                                                                    //         false
                                                                    //       }
                                                                    //     />
                                                                    //     {
                                                                    //       answerOption.answer
                                                                    //     }
                                                                    //   </label>
                                                                    // </div>
                                                                  )
                                                                )}
                                                            </div>
                                                          )}

                                                        {question?.question_type ===
                                                          "Free Text" && (
                                                            console.log(question),
                                                            <>
                                                            <h6 className="qusetion-question">{question.question}</h6>
                                                            <MyTextarea
                                                              className="custom-textarea"
                                                              name={`question_${question.question_id}`}
                                                              value={
                                                                selectAnswer[
                                                                question
                                                                  .question_id
                                                                ] ||
                                                                ''
                                                              }
                                                              onBlur={(e) =>
                                                                handleAnswerSelection(
                                                                  question.question_id,
                                                                  e.target
                                                                    .value,
                                                                  question.question_type,
                                                                  null,
                                                                  question.sno
                                                                )
                                                              }
                                                            />
                                                            </>
                                                          )}

                                                        {question?.question_type ===
                                                          "Radio Button" &&
                                                          question.question_id &&
                                                          question.answerlist?.map(
                                                            (
                                                              answerOption: any,
                                                              answerIndex: any
                                                            ) => {
                                                              const isChecked =
                                                                question.user_answers?.some(
                                                                  (
                                                                    userAnswer: any
                                                                  ) =>
                                                                    userAnswer.answer ===
                                                                    answerOption.answer
                                                                );
                                                              return (
                                                                <div
                                                                  key={
                                                                    answerIndex
                                                                  }
                                                                  className=" multiselect-option"
                                                                >
                                                                  <RadioBtn
                                                                    name={`question_${question.question_id}`}
                                                                    value={
                                                                      answerOption?.answer
                                                                    }
                                                                    checked={
                                                                      isChecked ||
                                                                      (
                                                                        selectAnswer[
                                                                        question
                                                                          .question_id
                                                                        ] ||
                                                                        []
                                                                      ).includes(
                                                                        answerOption.answer
                                                                      )
                                                                    }
                                                                    onChange={() =>
                                                                      handleAnswerSelection(
                                                                        question.question_id,
                                                                        answerOption.answer,
                                                                        question.question_type,
                                                                        null,
                                                                        question.sno
                                                                      )
                                                                    }
                                                                  />
                                                                </div>
                                                              );
                                                            }
                                                          )}
                                                      </div>
                                                    )
                                                  )
                                                : ""}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>

                                {item?.question_type == "file" && (
                                  // File Upload component ------------------------->
                                  <>
                                    {file1 ? (
                                      <div className="answer-section">
                                        <PrimaryBtn
                                          style={{
                                            backgroundColor:
                                              "var(--Colours-Primary-colour-Blue-500)",
                                            color:
                                              "var(--Colours-Neutral-colours-White-10)",
                                            border:
                                              "1px solid var(--Colours-Primary-colour-Blue-500)",
                                          }}
                                          onClick={handleFileInputClick}
                                          title=""
                                        >
                                          {/* <img
                                          src={require("../../assets/Icons/Style=Outlined (3).png")}
                                          width={24}
                                          height={24}
                                          style={{ marginRight: "10px", color: "var(--Colours-Primary-colour-Blue-500)" }}
                                          alt="upload"
                                        /> */}
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="2em"
                                            height="1.5em"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              fill="currentColor"
                                              fill-rule="evenodd"
                                              d="M10.738 16.627a1.492 1.492 0 0 1-1.487-1.362a37.117 37.117 0 0 1-.107-4.845a35.68 35.68 0 0 1-.253-.018l-1.49-.108a1.26 1.26 0 0 1-.97-1.935c1.097-1.716 3.106-3.636 4.76-4.824a1.388 1.388 0 0 1 1.619 0c1.653 1.188 3.662 3.108 4.759 4.824a1.26 1.26 0 0 1-.97 1.935l-1.49.108l-.253.018c.07 1.616.034 3.234-.107 4.845a1.492 1.492 0 0 1-1.487 1.362zm-.056-6.865a35.624 35.624 0 0 0 .063 5.365h2.51c.156-1.784.177-3.577.064-5.365a.75.75 0 0 1 .711-.796c.324-.016.647-.036.97-.06l1.081-.078a14.556 14.556 0 0 0-3.55-3.646L12 4.801l-.531.381a14.555 14.555 0 0 0-3.55 3.646L9 8.907c.323.023.647.043.97.059a.75.75 0 0 1 .711.796"
                                              clip-rule="evenodd"
                                            />
                                            <path
                                              fill="currentColor"
                                              d="M5.75 17a.75.75 0 0 0-1.5 0v2c0 .966.784 1.75 1.75 1.75h12A1.75 1.75 0 0 0 19.75 19v-2a.75.75 0 0 0-1.5 0v2a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25z"
                                            />
                                          </svg>
                                          Upload
                                        </PrimaryBtn>
                                        <input
                                          type="file"
                                          id="fileInput"
                                          className="ca-file"
                                          ref={fileInputRef}
                                          onChange={(e) =>
                                            handleAnswerSelection(
                                              item?.question_id,
                                              e.target.files?.[0],
                                              item?.question_type,
                                              null,
                                              item?.sno
                                            )
                                          }
                                          style={{ display: "none" }}
                                        />
                                        {selectedFileAnswer[
                                          item.question_id
                                        ] ? (
                                          <>
                                            <p className="text-success mt-2">
                                              {selectAnswer[
                                                item.question_id
                                              ]?.[0]?.answers || ""}
                                            </p>
                                          </>
                                        ) : (
                                          <p className="mt-2">
                                            <a
                                              style={{
                                                color:
                                                  "var(--Colours-Primary-colour-Blue-500)",
                                              }}
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleDownload(
                                                  item?.user_answers[0]
                                                    ?.answer[0]?.answers || ""
                                                );
                                              }}
                                            >
                                              {item?.user_answers &&
                                                item.user_answers[0]?.answer &&
                                                item.user_answers[0].answer[0]
                                                  ?.answers
                                                ? item.user_answers[0].answer[0]
                                                  .answers
                                                : ""}
                                              <img
                                                src={require("../../assets/Icons/arrow_outward.png")}
                                              />
                                            </a>
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="answer-section">
                                        <>
                                          <PrimaryBtn
                                            style={{
                                              backgroundColor:
                                                "var(--Colours-Primary-colour-Blue-500)",
                                              color:
                                                "var(--Colours-Neutral-colours-White-10)",
                                              border:
                                                "1px solid var(--Colours-Primary-colour-Blue-500)",
                                            }}
                                            onClick={handleFileInputClick}
                                            title=""
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="2em"
                                              height="1.5em"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                fill="currentColor"
                                                fill-rule="evenodd"
                                                d="M10.738 16.627a1.492 1.492 0 0 1-1.487-1.362a37.117 37.117 0 0 1-.107-4.845a35.68 35.68 0 0 1-.253-.018l-1.49-.108a1.26 1.26 0 0 1-.97-1.935c1.097-1.716 3.106-3.636 4.76-4.824a1.388 1.388 0 0 1 1.619 0c1.653 1.188 3.662 3.108 4.759 4.824a1.26 1.26 0 0 1-.97 1.935l-1.49.108l-.253.018c.07 1.616.034 3.234-.107 4.845a1.492 1.492 0 0 1-1.487 1.362zm-.056-6.865a35.624 35.624 0 0 0 .063 5.365h2.51c.156-1.784.177-3.577.064-5.365a.75.75 0 0 1 .711-.796c.324-.016.647-.036.97-.06l1.081-.078a14.556 14.556 0 0 0-3.55-3.646L12 4.801l-.531.381a14.555 14.555 0 0 0-3.55 3.646L9 8.907c.323.023.647.043.97.059a.75.75 0 0 1 .711.796"
                                                clip-rule="evenodd"
                                              />
                                              <path
                                                fill="currentColor"
                                                d="M5.75 17a.75.75 0 0 0-1.5 0v2c0 .966.784 1.75 1.75 1.75h12A1.75 1.75 0 0 0 19.75 19v-2a.75.75 0 0 0-1.5 0v2a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25z"
                                              />
                                            </svg>
                                            Upload
                                          </PrimaryBtn>
                                          <input
                                            type="file"
                                            id="fileInput"
                                            className="ca-file"
                                            ref={fileInputRef}
                                            onChange={(e) =>
                                              handleAnswerSelection(
                                                item?.question_id,
                                                e.target.files?.[0],
                                                item?.question_type,
                                                null,
                                                item?.sno
                                              )
                                            }
                                            style={{ display: "none" }}
                                          />
                                          {selectAnswer[item.question_id]?.[0]
                                            ?.answers ===
                                            item?.user_answers?.[0]?.answer?.[0]
                                              ?.answers ? (
                                            <>
                                              <p className="mt-2">
                                                <a
                                                  style={{
                                                    color:
                                                      "var(--Colours-Primary-colour-Blue-500)",
                                                  }}
                                                  href="#"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDownload(
                                                      item?.user_answers[0]
                                                        ?.answer[0]?.answers ||
                                                      ""
                                                    );
                                                  }}
                                                >
                                                  {item?.user_answers &&
                                                    item.user_answers[0]
                                                      ?.answer &&
                                                    item.user_answers[0].answer[0]
                                                      ?.answers
                                                    ? item.user_answers[0]
                                                      .answer[0].answers
                                                    : ""}
                                                  <img
                                                    src={require("../../assets/Icons/arrow_outward.png")}
                                                  />
                                                </a>
                                              </p>
                                            </>
                                          ) : (
                                            <p className="text-success mt-2">
                                              {selectAnswer[
                                                item.question_id
                                              ]?.[0]?.answers || ""}
                                            </p>
                                          )}
                                        </>
                                      </div>
                                    )}
                                  </>
                                )}
                                {item?.question_type &&
                                  // Link component ------------------------->
                                  item?.question_id &&
                                  item?.question_type.startsWith("{") ? (
                                  JSON.parse(item?.question_type).Link ===
                                    "link" ? (
                                    <div className="answer-section">
                                      <a
                                        style={{
                                          color:
                                            "var(--Colours-Primary-colour-Blue-500)",
                                        }}
                                        href={
                                          JSON.parse(item?.question_type).url
                                        }
                                        target="_blank"
                                      >
                                        {JSON.parse(item?.question_type).name}
                                        <img
                                          src={require("../../assets/Icons/arrow_outward.png")}
                                          style={{ marginLeft: "7px" }}
                                        />
                                      </a>
                                    </div>
                                  ) : (
                                    item?.question_type.name
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ) : null
                        )}
                      </>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5"></div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AnswerCard;
