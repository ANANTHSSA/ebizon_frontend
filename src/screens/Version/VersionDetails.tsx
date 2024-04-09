import React, { useContext, useEffect, useRef, useState } from "react";
import "../../styles/VersionDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { UseFetch } from "../../utills/UseFetch";
import axios from "axios";
import RadioBtn from "../../common/RadioBtn";
import { stateContext } from "../../utills/statecontact";
import MultiSelect from "../../common/MultiSelect";
import MyTextarea from "../../common/MyTextarea";
import Loading from "../../common/Loading";
import { useReactToPrint } from "react-to-print";
import PrimaryBtn from "../../common/PrimaryBtn";
// import { solutionName } from "../../utills/CountFunc";
import Toast from "../../common/Toast";

interface Item {
  version_no: string;
  version_comments: string;
  version_description: string;
  user_name: string;
  created_on: string;
  created_by: number;
  solution_id: number;
  solution_name: string;
  order_id: number;
}

interface SolutionItem {
  solution: {
    solution_id: string;
    version_no: string;
    // Add other properties if available
  };
  // Add other properties if available
}

const VersionDetails: React.FC = () => {
  const { solution_id, version_no } = useParams();

  const {
    state: { user_Data: { user_id, role_id }, token },
    dispatch,
  } = useContext(stateContext);


  const solutionPage = 1;

  const { data: versionList, error } = UseFetch(
    `/answers/versionList?user_id=${user_id}`,
    "GET",
    dispatch
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  function isVersionWithData(version: any): version is { data: Item[] } {
    return version && version.data && Array.isArray(version.data);
  }

  const versionArray: Item[] = isVersionWithData(versionList)
    ? versionList.data
    : [];



  const navigate = useNavigate();


  // useEffect(() => {
  //   console.log("selectedSolution changed to", selectedSolution);

  //   // Perform actions you want when selectedSolution changes
  //   // For example, you can fetch solution name based on selectedSolution
  //   // and then update the UI accordingly
  //   fetchSolutionName(selectedSolution)
  //     .then(solutionName => {
  //       // Update UI with the new solution name
  //       console.log("Solution name:", solutionName);
  //       // Refresh your code here based on the new solution
  //       // For example, you can call a function to re-render the code
  //       refreshCode();
  //     })
  //     .catch(error => {
  //       console.error("Error fetching solution name:", error);
  //     });
  // }, [selectedSolution]); // Dependency array ensures this effect runs only when selectedSolution changes

  // const refreshCode = () => {
  //   // Implement code refresh logic here
  //   console.log("Code refreshed!");
  // };

  // const fetchSolutionName = async (solutionId:any) => {
  //   // Simulated function to fetch solution name based on solutionId
  //   // You should replace this with your actual API call logic
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       // Simulating API call delay
  //       const solutionName = `Solution ${solutionId}`;
  //       resolve(solutionName);
  //     }, 1000); // Simulating 1 second delay
  //   });
  // };

  const solutionNamegf = versionArray?.reduce((uniqueSolutionNames: string[], vitems: any) => {
    if (!uniqueSolutionNames.includes(vitems.solution_name)) {
      uniqueSolutionNames.push(vitems.solution_name);
    }
    return uniqueSolutionNames;
  }, []);
  console.log('solutionNamegf', solutionNamegf);

  const [selectedSolution, setSelectedSolution] = useState<any>(Number(solution_id));
  console.log("selectedSolution", selectedSolution);


  const solution_name: any = solutionNamegf[selectedSolution - 1];
  console.log('solution_name', solution_name);




  const [selectedVersion, setSelectedVersion] = useState(Number(version_no));


  const [loading, setLoading] = useState(false);

  // useEffect to handle loading state changes when selectedSolution or selectedVersion changes
  useEffect(() => {
    setLoading(true); // Set loading to true when selectedSolution or selectedVersion changes

    // Simulated asynchronous operation
    const timeout = setTimeout(() => {
      setLoading(false); // Set loading to false when operation completes
    }, 1000); // Simulating 1 second delay

    // Cleanup function to clear the timeout in case component unmounts before operation completes
    return () => clearTimeout(timeout);
  }, [selectedSolution, selectedVersion]);


  function buildApiUrl(): string {
    let apiUrl = `/answers`;
    if (selectedSolution && selectedVersion) {
      apiUrl += `/versioningDetails?solution_id=${selectedSolution}&version_no=${selectedVersion}`;
    }
    return apiUrl;
  }

  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState<any>();
  // const { data: items, message } = UseFetch(buildApiUrl(), "GET", dispatch);
  console.log("items", items);
  console.log("message", message);

  //  rendering and fetching data
  useEffect(() => {
    const fetchItems = async () => {
      const url = buildApiUrl();
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status >= 200 && response.status < 300) {
          console.log("response", response);

          setItems(response.data);
          setMessage('');
        } else {
          setItems([]);
          setMessage('Unknown error occurred');
        }
      } catch (error) {
        setItems([]);
        setMessage('Error fetching items');
      }
    };
    fetchItems();
  }, [selectedSolution, selectedVersion, token]);



  const currentQuestions: any = items

    ?.map((item: any, index: number) => {
      return item.categorieslist.map((category: any, categoryIndex: number) => {
        return category.category.sub_category_list;
      });
    })

    .flat(2);

  const uniqueSolutionNames: string[] = [];

  const handleDownload = async (fileName: string) => {
    if (!fileName) {
      return;
    }

    try {
      const response = await axios.get(
        `answers/attachment?filename=${fileName}&mode=versioning&version_no=${version_no}`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status >= 200 && response.status < 300) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

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

    // Toggle dropdown 
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleDropdown1 = () => {
    setIsOpen1(!isOpen1);
  };



  ///////////////////////// pdf Generate ////////////////////////

  const componentPdf = useRef<HTMLDivElement>(null);
  const [showToast1, setShowToast1] = React.useState(false);

  const otherRoleMessage1 = {
    statusCode: 300,
    status: "Success",
    message: "Pdf generated successfully",
  };

//  solutionName for pdf title
  const solutionName1 = () => {
    return items?.map(
      (item: any) =>
        `${item.solution.solution_name}  

          ${new Date().toTimeString()}`
    );
  };

 
  // function to print pdf message after download
  const onAfterPrint = () => {
    setShowToast1(true);

  };
  const [isLoading, setIsLoading] = useState(false);

 // generate pdf with react-to-print
  const generatePdf = useReactToPrint({ content: () => componentPdf.current, documentTitle: `${solutionName1()}`, onBeforeGetContent: () => { setIsLoading(true) }, onAfterPrint: () => { setIsLoading(false); onAfterPrint(); }, })
    ;

  function formatDate(created_on: string): string {
    const dateObject = new Date(created_on);
    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }

  const refreshCode = () => {
    console.log("Code refreshed!");
    // Access the HTML element with the id "pdf" and update its content
    const pdfElement = document.getElementById("pdf");

    if (pdfElement) {
      // Create an anchor tag and set its href attribute to "#pdf" to navigate to the PDF element
      const anchorTag = document.createElement('a');
      anchorTag.href = "#";
      anchorTag.textContent = "Go to PDF";
      // Append the anchor tag to the body or any other container element
      document.body.appendChild(anchorTag);
      // You can trigger click event programmatically to navigate to the PDF element
      anchorTag.click();
      // Remove the anchor tag after navigating
      anchorTag.remove();
    }
  };

  // const { data: solution } = UseFetch(
  //   `/solutions?user_id=${user_id}&role_id=${role_id}&solution_page=${solutionPage}`,
  //   "GET",
  //   dispatch
  // );


  return (
    <>
      <div id="VersionDetails">
        <div id="pdf">
          <div className="filter">
            <div className="d-flex align-items-center justify-content-center">
              <div className={`custom-dropdown ms-2 ${isOpen ? "open" : ""} col-lg-3 col-md-3 `}>
                <div>
                  <p className="dropdown-label text-center">Select Solution </p>
                  <div
                    className="selected-option d-flex justify-content-between align-items-center"
                    onClick={handleToggleDropdown}
                  >
                    {solution_name ? (solution_name) : "Select an option"}
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
                    {versionArray?.map((vitems: any) => {
                      // doublicate solution name removal only original solution name will be shown
                      if (!uniqueSolutionNames?.includes(vitems.solution_name)) {
                        uniqueSolutionNames?.push(vitems.solution_name);
                        return (
                          <option
                            className="option"
                            key={vitems.solution_id}
                            value={vitems.solution_id}
                            onClick={() => {
                              setSelectedSolution(vitems.solution_id);
                              setIsOpen(false);
                              refreshCode();
                            }}
                          >
                            {vitems.solution_name}
                          </option>
                        );
                      }
                    })}
                  </div>
                )}
              </div>

              <div className={`custom-dropdown ms-2 ${isOpen ? "open" : ""} col-lg-3 col-md-2`}>
                <div>
                  <p className="ms-2 dropdown-label text-center">Select Version </p>
                  <div
                    className="selected-option d-flex justify-content-between align-items-center"
                    onClick={handleToggleDropdown1}
                  >
                    {selectedVersion ? selectedVersion : "Select an option"}
                    <img
                      src={require("../../assets/Icons/dropDown.png")}
                      width={24}
                      height={24}
                      alt="dropdown-icon"
                    />
                  </div>
                </div>

                {isOpen1 && (
                  <div className="options">
                    {versionArray
                      ?.filter(
                        (item: any) => item.solution_id == selectedSolution
                      )
                      ?.map((item: any) => (
                        <option
                          className="option"
                          key={item.version_no}
                          value={item.version_no}
                          onClick={() => {
                            setSelectedVersion(item.version_no);
                            setIsOpen1(false);
                            refreshCode();
                          }}
                        >
                          {item.version_no}
                        </option>
                      ))}
                  </div>
                )}

              </div>
              <div className="col-lg-3 col-md-4 text-end version-btn mt-4">
                <PrimaryBtn
                  onClick={() => generatePdf()}
                  title=''
                >
                  Print
                </PrimaryBtn>
              </div>
            </div>
          </div>
          <div className="hash-icon">
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.58 13.42L20 12L12 4L4 12Z" fill="#141B2E" />
              </svg>
            </a>
          </div>
          <div ref={componentPdf}>
            {!loading ? (
              <>
                <div className="Details px-5" style={{ marginTop: "1rem", marginBottom: "1rem", width: "85%" }} >
                  {!message && (
                    <h2 className="cat-heading fw-bold" style={{ marginTop: "3rem", marginBottom: "3rem" }}>Version Details</h2>
                  )}

                  {items?.map((item: any) => (
                    console.log(item),

                    <>
                      <div className="d-flex"><p className="subcat-heading1 col-3">Solution Name  </p> <p className="subcat-heading1 col-1">-</p> <p className="subcat-heading1 col-4">{item?.solution?.solution_name}</p></div>
                      <div className="d-flex"><p className="subcat-heading1 col-3">Submitted By  </p> <p className="subcat-heading1 col-1">-</p> <p className="subcat-heading1 col-4">{item?.solution?.user_name}</p></div>
                      <div className="d-flex"><p className="subcat-heading1 col-3">Version No   </p> <p className="subcat-heading1 col-1">-</p> <p className="subcat-heading1 col-4">{item?.solution?.version_no}</p></div>
                      <div className="d-flex"><p className="subcat-heading1 col-3">Description </p> <p className="subcat-heading1 col-1">-</p> <p className="subcat-heading1 col-4">{item?.solution?.version_description}</p></div>
                      <div className="d-flex"><p className="subcat-heading1 col-3">Date  </p> <p className="subcat-heading1 col-1">-</p> <p className="subcat-heading1 col-4">{formatDate(item?.solution?.created_on)}</p></div>
                    </>
                  ))}
                </div>
                <div className="ps-5">
                  {!message ? (
                    <div>
                      {
                        items?.map((item: any, index: number) => {
                          return (
                            <div key={index} className="version-question">
                              {item.categorieslist?.map(
                                (category: any, categoryIndex: number) => {
                                  return (
                                    <div key={categoryIndex} className="px-3">
                                      <h3 className="text-center fw-bold cat-heading pt-1">
                                        {category.category.cat_name}
                                      </h3>
                                      {category.category?.sub_category_list?.map(
                                        (subCategory: any, subCategoryIndex: number) => {
                                          return (
                                            <div key={subCategoryIndex}>
                                              <h5 className="subcat-heading fw-bold my-3">
                                                {subCategory.sub_cat_name}
                                              </h5>
                                              <div className="">
                                                {subCategory.qalist?.map(
                                                  (question: any, index: number) => {
                                                    {
                                                      if (question.order_id !== 0) {
                                                        return (
                                                          <div className="row align-items-start pt-1">
                                                            <div className="col-6 ">
                                                              <p className="d-inline question">
                                                                {question.order_id}.
                                                              </p>
                                                              <p className="d-inline ms-2 question">
                                                                {question.question}
                                                              </p>
                                                            </div>
                                                            <div className="col-6">
                                                              {question.question_type ===
                                                                "Free Text" && (

                                                                  <div
                                                                    className="form-control " style={{ height: question.user_answers && question.user_answers.length > 0 ? "auto" : "5rem" }}
                                                                  // tabIndex={`question_${question.question_id}`}
                                                                  // Render user answers as comma-separated string
                                                                  // If question.user_answers is an array of strings, you can directly join them
                                                                  // If it's an array of objects with 'answer' property, you can map them to extract 'answer' property and then join
                                                                  >
                                                                    <p > {question.user_answers && question.user_answers.map((answer: any) => answer.answer).join(", ")}</p>
                                                                  </div>



                                                                )}

                                                              {question.question_type ===
                                                                "Multi Select" &&
                                                                question.question_id && (
                                                                  <div className="">
                                                                    <div className="row">
                                                                      {question.answerlist &&
                                                                        question.answerlist?.map(
                                                                          (
                                                                            answerOption: any,
                                                                            answerIndex: number
                                                                          ) => {
                                                                            const isChecked =
                                                                              question.user_answers?.some(
                                                                                (
                                                                                  ans: any
                                                                                ) =>
                                                                                  ans.answer?.some(
                                                                                    (
                                                                                      nestedAnswer: any
                                                                                    ) =>
                                                                                      answerOption.possible_answer_id ===
                                                                                      nestedAnswer.ans_id
                                                                                  )
                                                                              ) || false; // Set to false if not found
                                                                            return (
                                                                              <div
                                                                                key={
                                                                                  answerIndex
                                                                                }
                                                                                className="col-6 my-2"
                                                                              >
                                                                                <label className="d-flex custom-checkbox">
                                                                                  <div>
                                                                                    <MultiSelect
                                                                                      type="checkbox"
                                                                                      name={`question_${question.question_id}`}
                                                                                      value={
                                                                                        answerOption.possible_answer_id
                                                                                      }
                                                                                      disabled={
                                                                                        true
                                                                                      }
                                                                                      checked={
                                                                                        isChecked
                                                                                      }

                                                                                    // className="hidden-checkbox"
                                                                                    />
                                                                                  </div>
                                                                                  <div className="ms-2">
                                                                                    {
                                                                                      answerOption.answer
                                                                                    }
                                                                                  </div>
                                                                                </label>
                                                                              </div>
                                                                            );
                                                                          }
                                                                        )}
                                                                    </div>
                                                                  </div>
                                                                )}

                                                              {item?.question !== "Start Date" &&
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
                                                                            item?.user_answers &&
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
                                                                )}

                                                              <div className="">
                                                                <div className="row">
                                                                  {question.question_type ===
                                                                    "Radio Button" &&
                                                                    question.follow_up ===
                                                                    null &&
                                                                    question.question_id &&
                                                                    question.answerlist &&
                                                                    question.answerlist?.map(
                                                                      (
                                                                        answerOption: any,
                                                                        answerIndex: number
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
                                                                            className="col-6 "
                                                                          >
                                                                            <label className="d-flex">
                                                                              <div>
                                                                                <RadioBtn
                                                                                  // type="radio"
                                                                                  name={`question_${question.question_id}`}
                                                                                  value={""}
                                                                                  checked={
                                                                                    isChecked
                                                                                  }
                                                                                  disabled={
                                                                                    true
                                                                                  }
                                                                                />
                                                                              </div>
                                                                              <div className="ms-2">
                                                                                {
                                                                                  answerOption.answer
                                                                                }
                                                                              </div>
                                                                            </label>
                                                                          </div>
                                                                        );
                                                                      }
                                                                    )}
                                                                </div>
                                                              </div>

                                                              <div className="row">
                                                                {question.question_type ===
                                                                  "Radio Button" &&
                                                                  question.follow_up &&
                                                                  question.question_id &&
                                                                  question.answerlist &&
                                                                  question.answerlist?.map(
                                                                    (
                                                                      answerOption: any,
                                                                      answerIndex: number
                                                                    ) => {
                                                                      const isChecked =
                                                                        question.user_answers?.some(
                                                                          (
                                                                            userAnswer: any
                                                                          ) =>
                                                                            userAnswer.answer ===
                                                                            answerOption.answer
                                                                        );
                                                                      const singleUserAnswer =
                                                                        question.user_answers?.flatMap(
                                                                          (
                                                                            userAnswer: any
                                                                          ) =>
                                                                            userAnswer.answer
                                                                        );

                                                                      const user_answer =
                                                                        singleUserAnswer.find(
                                                                          (answer: any) =>
                                                                            answer !== null
                                                                        );

                                                                      // Now, singleUserAnswer contains the first non-null element in the user_answer array

                                                                      let foundItem: any =
                                                                        null;

                                                                      if (isChecked) {
                                                                        foundItem =
                                                                          question.follow_up.find(
                                                                            (item: any) => {
                                                                              return (
                                                                                item.criteria ===
                                                                                user_answer
                                                                              );
                                                                            }
                                                                          );
                                                                      }
                                                                      return (
                                                                        <div
                                                                          key={answerIndex}
                                                                          className="col-6 "
                                                                        >
                                                                          <label className="">
                                                                            <div>
                                                                              <RadioBtn
                                                                                //   type="radio"
                                                                                name={`question_${question.question_id}`}
                                                                                value={""}
                                                                                checked={
                                                                                  isChecked
                                                                                }
                                                                                disabled={
                                                                                  true
                                                                                }
                                                                              />
                                                                              <div className=""></div>
                                                                            </div>
                                                                            {
                                                                              answerOption.answer
                                                                            }
                                                                            {isChecked
                                                                              ? (foundItem =
                                                                                question.follow_up.find(
                                                                                  (
                                                                                    item: any
                                                                                  ) =>
                                                                                    item.criteria ===
                                                                                    user_answer
                                                                                )) &&
                                                                              currentQuestions
                                                                                ?.map(
                                                                                  (
                                                                                    item: any
                                                                                  ) =>
                                                                                    item?.qalist?.find(
                                                                                      (
                                                                                        qitem: any
                                                                                      ) =>
                                                                                        foundItem.id ===
                                                                                        qitem.question_id
                                                                                    )
                                                                                )
                                                                                ?.map(
                                                                                  (
                                                                                    question: any,
                                                                                    index: number
                                                                                  ) => (
                                                                                    <div
                                                                                      key={
                                                                                        index
                                                                                      }
                                                                                    >
                                                                                      {question?.question_type ===
                                                                                        "Multi Select" && (
                                                                                          <div className="row">
                                                                                            {question.answerlist &&
                                                                                              question.answerlist?.map(
                                                                                                (
                                                                                                  answerOption: any,
                                                                                                  answerIndex: number
                                                                                                ) => {
                                                                                                  const isChecked =
                                                                                                    question.user_answers?.some(
                                                                                                      (
                                                                                                        ans: any
                                                                                                      ) =>
                                                                                                        ans.answer?.some(
                                                                                                          (
                                                                                                            nestedAnswer: any
                                                                                                          ) =>
                                                                                                            answerOption.possible_answer_id ===
                                                                                                            nestedAnswer.ans_id
                                                                                                        )
                                                                                                    ) ||
                                                                                                    false;
                                                                                                  return (
                                                                                                    <div
                                                                                                      key={
                                                                                                        answerIndex
                                                                                                      }
                                                                                                      className="col-12 mb-3"
                                                                                                    >
                                                                                                      <label className="custom-checkbox">
                                                                                                        <MultiSelect
                                                                                                          type="checkbox"
                                                                                                          name={`question_${question.question_id}`}
                                                                                                          value={
                                                                                                            answerOption.possible_answer_id
                                                                                                          }
                                                                                                          disabled={
                                                                                                            true
                                                                                                          }
                                                                                                          checked={
                                                                                                            isChecked
                                                                                                          }
                                                                                                        />
                                                                                                        {
                                                                                                          answerOption.answer
                                                                                                        }
                                                                                                      </label>
                                                                                                    </div>
                                                                                                  );
                                                                                                }
                                                                                              )}
                                                                                          </div>
                                                                                        )}

                                                                                      {question?.question_type ===
                                                                                        "Free Text" && (
                                                                                          <div className="">
                                                                                            <MyTextarea
                                                                                              className="form-control"
                                                                                              style={{ height: "5rem" }}
                                                                                              name={`question_${question.question_id}`}
                                                                                              value={
                                                                                                question.user_answers &&
                                                                                                question.user_answers?.map(
                                                                                                  (
                                                                                                    answer: any
                                                                                                  ) =>
                                                                                                    answer.answer
                                                                                                )
                                                                                              }
                                                                                              disabled={
                                                                                                true
                                                                                              }
                                                                                            />
                                                                                          </div>
                                                                                        )}

                                                                                      {question?.question_type ===
                                                                                        "Radio Button" &&
                                                                                        question.question_id &&
                                                                                        question.answerlist?.map(
                                                                                          (
                                                                                            answerOption: any,
                                                                                            answerIndex: number
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
                                                                                                className="col-6"
                                                                                              >
                                                                                                <label
                                                                                                  className=""
                                                                                                //   style={{
                                                                                                //     display:
                                                                                                //       "block",
                                                                                                //   }}
                                                                                                >
                                                                                                  <RadioBtn
                                                                                                    // type="radio"
                                                                                                    name={`question_${question.question_id}`}
                                                                                                    value={
                                                                                                      ""
                                                                                                    }
                                                                                                    checked={
                                                                                                      isChecked
                                                                                                    }
                                                                                                    disabled={
                                                                                                      true
                                                                                                    }
                                                                                                  />
                                                                                                  {
                                                                                                    answerOption.answer
                                                                                                  }
                                                                                                </label>
                                                                                              </div>
                                                                                            );
                                                                                          }
                                                                                        )}
                                                                                    </div>
                                                                                  )
                                                                                )
                                                                              : ""}
                                                                          </label>
                                                                        </div>
                                                                      );
                                                                    }
                                                                  )}
                                                              </div>

                                                              {question.question_type ===
                                                                "file" &&
                                                                question.question_id && (
                                                                  <div className="mb-5">
                                                                    <a
                                                                      style={{ color: "var(--Colours-Primary-colour-Blue-500)" }}
                                                                      href="#"
                                                                      onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDownload(
                                                                          question
                                                                            ?.user_answers[0]
                                                                            ?.answer[0]
                                                                            ?.answers || ""
                                                                        );
                                                                      }}
                                                                    >
                                                                      {question?.user_answers &&
                                                                        question
                                                                          .user_answers[0]
                                                                          ?.answer &&
                                                                        question
                                                                          .user_answers[0]
                                                                          .answer[0]?.answers
                                                                        ? question
                                                                          .user_answers[0]
                                                                          .answer[0]
                                                                          .answers
                                                                        : question
                                                                          ?.user_answers[0]
                                                                          ?.answer ===
                                                                          null
                                                                          ? ""
                                                                          : ""}
                                                                      <img
                                                                        src={require("../../assets/Icons/arrow_outward.png")}
                                                                        alt="link"
                                                                        style={{
                                                                          marginLeft: "0.5rem",
                                                                        }}
                                                                      />
                                                                    </a>
                                                                  </div>
                                                                )}

                                                              {question.question_type ===
                                                                "Dropdown" &&
                                                                question.question_id && (
                                                                  <div className="">
                                                                    <select
                                                                      className="form-control"
                                                                      disabled={true}
                                                                      value={
                                                                        (question.user_answers &&
                                                                          question.user_answers?.map(
                                                                            (answer: any) =>
                                                                              answer.answer
                                                                          ))[0] || ""
                                                                      }
                                                                    >
                                                                      <option
                                                                        value=""
                                                                        disabled
                                                                      >
                                                                        Select an option
                                                                      </option>
                                                                      {question.answerlist?.map(
                                                                        (
                                                                          answerOption: any,
                                                                          answerIndex: number
                                                                        ) => (
                                                                          <option
                                                                            key={
                                                                              answerIndex
                                                                            }
                                                                            value={
                                                                              answerOption.answer
                                                                            }
                                                                            className=""
                                                                          >
                                                                            {
                                                                              answerOption.answer
                                                                            }
                                                                          </option>
                                                                        )
                                                                      )}
                                                                    </select>
                                                                  </div>
                                                                )}
                                                              <div>
                                                                {question.question_type ===
                                                                  "Date" &&
                                                                  question.question_id && (
                                                                    <div className="">
                                                                      <div>
                                                                        <input
                                                                          className="form-control"
                                                                          type="date"
                                                                          name={`start_date_${question.question_id}`}
                                                                          value={
                                                                            question.user_answers &&
                                                                            question.user_answers?.map(
                                                                              (
                                                                                answer: any
                                                                              ) =>
                                                                                answer.answer
                                                                            )
                                                                          }
                                                                          disabled={true}
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                              </div>
                                                              <p className="mb-4">
                                                                {question.question_type &&
                                                                  question.question_id &&
                                                                  question.question_type.startsWith(
                                                                    "{"
                                                                  ) ? (
                                                                  JSON.parse(
                                                                    question.question_type
                                                                  ).Link === "link" ? (
                                                                    <>
                                                                      <a
                                                                        href={
                                                                          JSON.parse(
                                                                            question.question_type
                                                                          ).url
                                                                        }
                                                                        target="_blank"
                                                                      >
                                                                        {
                                                                          JSON.parse(
                                                                            question.question_type
                                                                          ).name
                                                                        }
                                                                      </a>
                                                                      <img
                                                                        src={require("../../assets/Icons/arrow_outward.png")}
                                                                        alt="link"
                                                                      />
                                                                    </>
                                                                  ) : (
                                                                    question.question_type
                                                                      .name
                                                                  )
                                                                ) : (
                                                                  <></>
                                                                )}
                                                              </p>
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    }
                                                  }
                                                )}
                                              </div>
                                              {subCategoryIndex % 2 == 0 && ( // Insert a page break after every two subcategories
                                                <div
                                                  style={{ pageBreakAfter: "always", marginTop: "20px" }}
                                                  className="pagerect"
                                                  key={`page-break-${subCategoryIndex}`}
                                                >
                                                  {isLoading && <div>Loading...</div>}  {/* <div className="page-number">Page {pageNumber}</div> */}
                                                </div>

                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  );
                                }
                              )}

                            </div>
                          );
                        })

                      }
                    </div>
                  ) : (
                    // <h3 className="text-center fw-bold cat-heading">This version is Not Available</h3>
                    <div className="text-center cat-heading1">

                      <h3 className="ms-5 warn fw-bold " ><svg xmlns="http://www.w3.org/2000/svg" className="me-2" width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <path d="M12 6.49L19.53 19.5H4.47L12 6.49ZM12 2.5L1 21.5H23L12 2.5ZM13 16.5H11V18.5H13V16.5ZM13 10.5H11V14.5H13V10.5Z" fill="#A9720D" />
                      </svg>This version is Not Available</h3>
                    </div>

                  )}

                </div>
              </>
            )
              : (<><Loading /></>)


            }
          </div>
          {showToast1 && (<Toast messages={otherRoleMessage1} onClose={() => setShowToast1(false)} />)}
        </div>
      </div>
    </>
  );
}

export default VersionDetails;
