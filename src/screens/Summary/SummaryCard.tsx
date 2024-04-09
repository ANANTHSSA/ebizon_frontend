import React, { useEffect, useState } from "react";
import "../../styles/SummaryCard.scss";

import axios from "axios";
import RadioBtn from "../../common/RadioBtn";
import MyTextarea from "../../common/MyTextarea";
import MultiSelect from "../../common/MultiSelect";
interface SummaryCardCardProps {
  qulist: any;
  selectAnswer?: any;
  setSelectAnswer?: any;
  token?: any;
  currentQuestions?: any;
}

const SummaryCard: React.FC<SummaryCardCardProps> = ({
  qulist,
  selectAnswer = {},
  setSelectAnswer = () => { },
  token,
  currentQuestions,

}) => {
   const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectAnswer((prevSelectAnswer: any) => {
      const updatedSelectAnswer = { ...prevSelectAnswer };

      qulist?.forEach((question: any) => {
        const { question_id, question_type, answers, user_answers } = question;

        // Only update the state for questions of type 'Multi Select'
        if (question_type === "Multi Select") {
          // If there are user answers, iterate over them and update the state
          if (user_answers && user_answers.length > 0) {
            const questionAnswers: any[] = [];
            user_answers.forEach((userAnswer: any) => {
              const { ans_id, answer } = userAnswer;

              // Check if the userAnswer has 'answer' property and is an array
              if (Array.isArray(answer) && answer.length > 0) {
                // Iterate over each object in the 'answer' array
                answer.forEach((ansObj) => {
                  const updatedEntry = {
                    ans_id: ansObj?.ans_id || null,
                    answers: ansObj?.answers || null,
                  };

                  // Check if the updatedEntry is not already in the state
                  const entryExists = questionAnswers.some(
                    (entry) => entry.ans_id === updatedEntry.ans_id
                  );

                  if (!entryExists) {
                    questionAnswers.push(updatedEntry);
                  }
                });
              } else if (typeof answer === "string") {
                // If 'answer' is not an array, create a single-entry array
                const updatedEntry = {
                  ans_id: ans_id || null,
                  answers: answer || null,
                };

                // Check if the updatedEntry is not already in the state
                const entryExists = questionAnswers.some(
                  (entry) => entry.ans_id === updatedEntry.ans_id
                );

                if (!entryExists) {
                  questionAnswers.push(updatedEntry);
                }
              }
            });

            // Update the state for the current question ID
            updatedSelectAnswer[question_id] = questionAnswers;
          } else {
            // If no user answers, create a new entry with default or null values
            const possible_answer_id = answers?.[0]?.possible_answer_id;
            const updatedEntry = {
              ans_id: possible_answer_id || null,
              answers: answers || null,
            };

            // Update the state for the current question ID
            updatedSelectAnswer[question_id] = [updatedEntry];
          }
        } else if (
          question_type === "Free Text" ||
          question_type === "Date" ||
          question_type === "Dropdown" ||
          question_type === "Radio Button" ||
          question_type === "file"
        ) {
          // Update the state for the current question ID
          updatedSelectAnswer[question_id] = user_answers?.[0]?.answer;
        }
      });

      return updatedSelectAnswer;
    });
  }, [qulist]);

  const handleDownload = async (fileName1: string) => {
    console.log("fileName", fileName1);
    if (!fileName1) {
      console.error("File name is undefined");
      return;
    }

    try {
      const response = await axios.get(
        `answers/attachment?filename=${fileName1}`,
        { responseType: "blob", headers: { "Authorization": `Bearer ${token}` } }
      );
      console.log("response", response);
      if (response.status >= 200 && response.status < 300) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Create an invisible link element
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName1);

        // Append the link to the body and programmatically click it
        document.body.appendChild(link);
        link.click();

        // Remove the link from the DOM after the download
        document.body.removeChild(link);
      } else {
        console.error("Error downloading file. Status:", response.status);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <section id="summaryCard">
      <section id="Answer">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7 ">
            <div className="answer-body">
              {/* <div className="row">
                {qulist
                  // lock question---------------->
                  // filtering questions based on question type ------------>

                  ?.filter((item: any) => item.question_type === "Date")
                  ?.map((filteredItem: any, index: number) => (
                    <div className="col-12" key={index}>
                      {filteredItem.question === "Start Date" && (
                        // Start Date component disabled ------------------------->
                        <>
                          <div className="d-flex">
                            <p className="qusetion-number me-1">
                              {filteredItem?.sno}
                            </p>
                            <span className="me-2">.</span>
                            {filteredItem?.mandatory === 1 ? (
                              <>
                                <p className="qusetion-question">
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
                            <p className="summary-answer">{selectAnswer[
                              filteredItem.question_id
                            ] ||
                              (filteredItem.user_answers &&
                                filteredItem.user_answers?.map(
                                  (answer: any) => answer.answer
                                ))}</p>
                          </div>
                        </>
                      )}
                      {filteredItem.question === "End Date" && (
                        // End Date component disabled------------------------->
                        <>
                          <div className="d-flex">
                            <p className="qusetion-number me-1">
                              {filteredItem?.sno}
                            </p>
                            <span className="me-2">.</span>
                            {filteredItem?.mandatory === 1 ? (
                              <>
                                <p className="qusetion-question">
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
                            <p className="summary-answer">{selectAnswer[
                              filteredItem.question_id
                            ] ||
                              (filteredItem.user_answers &&
                                filteredItem.user_answers?.map(
                                  (answer: any) => answer.answer
                                ))}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div> */}

              {qulist?.map((item: any, index: number) => (
                <>
                  {item.sno !== 0 ? (
                    <>
                      <div className="d-flex">
                        {/* {item?.question !== "Start Date" &&
                          item?.question !== "End Date" && (
                            <> */}
                              <p className="qusetion-number me-1">
                                {item.sno}
                              </p>
                              <span className="me-2">.</span>
                              {item?.mandatory === 1 ? (
                                <>
                                  <p className="qusetion-question">
                                    {item?.question}
                                    <span>*</span>
                                  </p>{" "}
                                </>
                              ) : (
                                <p className="qusetion-question">
                                  {item?.question}
                                </p>
                              )}
                            {/* </>
                          )} */}
                      </div>
                      <div>
                        {item?.question_type === "Free Text" && (
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
                                          // onClick={handleToggleDropdown}
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
                                                // onClick={() =>
                                                //   handleAnswerSelection(
                                                //     item?.question_id,
                                                //     answerOption?.answer,
                                                //     item?.question_type,
                                                //     null,
                                                //     item?.sno
                                                //   )
                                                // }
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
                                              // onChange={() =>
                                              //   handleAnswerSelection(
                                              //     item?.question_id,
                                              //     answerOption.answer,
                                              //     item?.question_type,
                                              //     null,
                                              //     item?.sno
                                              //   )
                                              // }
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
                                                            // onChange={(e) =>
                                                            //   handleAnswerSelection(
                                                            //     question.question_id,
                                                            //     e.target.value,
                                                            //     question.question_type,
                                                            //     null,
                                                            //     question.sno
                                                            //   )
                                                            // }
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
                                                                  // onChange={() =>
                                                                  //   handleAnswerSelection(
                                                                  //     question.question_id,
                                                                  //     answerOption.answer,
                                                                  //     question.question_type,
                                                                  //     null,
                                                                  //     question.sno
                                                                  //   )
                                                                  // }
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
                        {/* {item?.question_type === "Multi Select" && (
                          // Multi Select component ------------------------->
                          <div className="answer-section">
                            {item?.answerlist?.map(
                              (answerOption: any, answerIndex: number) => {
                                const selectedAnswers =
                                  selectAnswer[item?.question_id] || [];
                                const matchingAnswers = selectedAnswers?.filter(
                                  (selectedAnswer: any) =>
                                    selectedAnswer.ans_id ===
                                    answerOption.possible_answer_id
                                );

                                return (
                                  <div className="summary-multiselect" key={answerIndex}>
                                    {matchingAnswers.length > 0 && (
                                      <>
                                        {matchingAnswers?.map(
                                          (answer: any, index: number) => (
                                            <p className="summary-answer">{answer?.answers}</p>
                                          )
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )} */}

                        {/* {item?.question_type === "Dropdown" && (
                          // Dropdown component ------------------------->
                          <div className="answer-section">
                            <p className="summary-answer"> {selectAnswer &&
                              selectAnswer[item?.question_id]}</p>
                          </div>
                        )} */}
                        {/* {item?.question_type === "Radio Button" && (
                          // Radio Button component ------------------------->
                          <div className="answer-section">
                            {item?.answerlist?.map((answerOption: any, answerIndex: number) => {
                              const isChecked = item?.user_answers?.filter(
                                (userAnswer: any) => userAnswer?.answer === answerOption?.answer
                              );
                              console.log(item?.follow_up, "item?.follow_up");

                              const followUp = item.follow_up?.find((answer: any, index: number) => {
                                answer.id = qulist[index].question_id
                              })
                              console.log("followUp", followUp);

                              return (
                                <div className="summary-multiselect" key={answerIndex}>
                                  {isChecked.length > 0 && (
                                    <>
                                      {isChecked?.map((answer: any, index: number) => (
                                        <p className="summary-answer">{answer?.answer}</p>
                                      ))}
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )} */}
                         {/* <div className="answer-section">
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
                                              // onChange={() =>
                                              //   handleAnswerSelection(
                                              //     item?.question_id,
                                              //     answerOption.answer,
                                              //     item?.question_type,
                                              //     null,
                                              //     item?.sno
                                              //   )
                                              // }
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
                                                          console.log(question),
                                                          
                                                         <>
                                                          <h6 className="qusetion-question">{question?.question}</h6>
                                                          <p
                                                            className=""    
                                                          > {question?.user_answers[0]?.answer ? question?.user_answers[0]?.answer :  "not answer" }</p>
                                                          </>
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
                                                                  // onChange={() =>
                                                                  //   handleAnswerSelection(
                                                                  //     question.question_id,
                                                                  //     answerOption.answer,
                                                                  //     question.question_type,
                                                                  //     null,
                                                                  //     question.sno
                                                                  //   )
                                                                  // }
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
                              </div> */}
                        {/* {item?.question !== "Start Date" &&
                          item?.question !== "End Date" &&
                          item?.question_type === "Date" &&
                          item?.question_id && (
                            <div className="date-row">
                              <div className="answer-section">
                                <div>
                                  <p className="summary-answer">{
                                    selectAnswer[
                                    item?.question_id
                                    ] ||
                                    (item?.user_answers &&
                                      item?.user_answers?.map(
                                        (answer: any) => answer.answer
                                      ))
                                  }

                                  </p>
                                </div>
                              </div>
                            </div>
                          )} */}
                        {item?.question_type === "file" && (
                          // file component ------------------------->  
                          <div className="answer-section"><p className="mt-2">
                            <a
                              className="download-file"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDownload(
                                  item
                                    ?.user_answers[0]
                                    ?.answer[0]
                                    ?.answers || ""
                                );
                              }}
                            >
                              {item?.user_answers &&
                                item.user_answers[0]
                                  ?.answer &&
                                item.user_answers[0]
                                  .answer[0]?.answers
                                ? item.user_answers[0]
                                  .answer[0].answers
                                : ""}
                            </a>
                          </p></div>
                        )}
                      </div>
                    </>
                  ) : null}
                </>
              ))}
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5"></div>
        </div>
      </section>
    </section>
  );
};

export default SummaryCard;
