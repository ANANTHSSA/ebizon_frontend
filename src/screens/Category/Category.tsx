/* The above code is a TypeScript React component that represents a category page. It fetches data from
an API endpoint to get the category information and displays it in a card format. Each category card
shows the category name, a progress bar indicating the completion status, the percentage of
completion, the number of mandatory questions, and options to lock/unlock the category and view the
category details. The component also provides buttons to lock/unlock all categories and a button to
navigate to the summary page. It uses various utility functions and components such as ProgressBar,
UseFetch, PrimaryBtn, SeconderyBtn, Loading, */
import React, { Fragment, useContext, useEffect, useState } from "react";
import ProgressBar from "../../common/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import { UseFetch } from "../../utills/UseFetch";
import "../../styles/Category.scss";
import { getMantoryCount } from "../../utills/CountFunc";
import PrimaryBtn from "../../common/PrimaryBtn";
import SeconderyBtn from "../../common/SeconderyBtn";
import { stateContext } from "../../utills/statecontact";
import Loading from "../../common/Loading";
import Toast from "../../common/Toast";

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
interface CategoryMandatoryDataInfo {
  mandatory_filled_status: boolean;
  cat_name: string;
  cat_id: number;
  answers_count: number;
  mandatory_answers_count: number;
  mandatory_question_count: number;
  lock: number;
}

const Category: React.FC = () => {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const {
    state: {
      user_Data: { user_id, role_id },
    },
    dispatch,
  } = useContext(stateContext);

  /* The above code is a TypeScript React component that is making multiple API calls using the
`UseFetch` hook. */
  const {
    data,
    error,
    setRefetch: setRefetchData,
  } = UseFetch(
    `answers/categoriesStatus?solution_id=${solutionId}&user_id=${user_id}`,
    "GET"
  );
  console.log(data);

  const solutionName = categories[0]?.solution_name;

  const { data: mandatoryData, setRefetch: setRefetchMan } = UseFetch(
    `/answers/mandatoryStatus?solution_id=${solutionId}`,
    "GET"
  );
  console.log("mandatoryData", mandatoryData);

  const mandatoryfilter = mandatoryData?.every(
    (item: any) => item.mandatory_question_count === 0
  );

  const { apiCall: modelLockApiCall, message: lockMessage } = UseFetch(
    "/categories/lock",
    "PUT"
  );

  const { apiCall: modelLockUnlockApiCall, message: lockUnlockMessage } =
    UseFetch("/categories/lock/solution", "PUT");

  useEffect(() => {
    setCategories(data);
  }, [data]);
  const [showToastLock, setShowToastLock] = useState(false);

  const [showToastAllLock, setShowToastAllLock] = useState(false);

  const lockAllCategories = () => {
    const inputDateString = new Date().toISOString();
    const utcDate = inputDateString.slice(0, 19).replace("T", " ");
    const lockPayload = {
      lockType: true,
      updated_on: utcDate,
      updated_by: 39,
    };

    modelLockUnlockApiCall(lockPayload, solutionId);
    setShowToastAllLock(true);
    setRefetchData(true);
  };

  const unlockAllCategories = () => {
    const inputDateString = new Date().toISOString();
    const utcDate = inputDateString.slice(0, 19).replace("T", " ");
    const lockPayload = {
      lockType: false,
      updated_on: utcDate,
      updated_by: user_id,
    };

    modelLockUnlockApiCall(lockPayload, solutionId);
    setShowToastAllLock(true);
    setRefetchData(true);
  };

  const lockFunc = (currentLock: any, catid: any) => {
    console.log(currentLock, catid);
    
    try {
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const putPayload = {
        lockType: currentLock === 0 ? true : false,
        updated_on: utcDate,
        updated_by: user_id,
      };

      modelLockApiCall(putPayload, catid);
      setShowToastLock(true);
      setRefetchData(true);
      setCategories((prevCategories) => {
        return prevCategories.map((category) =>
          category.cat_id === catid
            ? { ...category, lockType: currentLock === 0 ? true : false }
            : category
        );
      });
      const updatedCategories = categories.map((item) =>
        item.cat_id === catid ? { ...item, locked: 1 - currentLock } : item
      );

      setCategories(updatedCategories);
    } catch (error) {
      console.error(error);
    }
  };

  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }
  const navigateSummary = () => {
    const mandatory = {
      mandatorystate: false,
      solution_id: solutionId,
      type: "Summary",
    };
    const popupDataString = JSON.stringify(mandatory);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: mandatory,
    });
    navigate(`/Home/Summary/${solutionId}`);
  };

  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }
  return (
    <section id="category">
      {categories?.length > 0 ? (
        <>
          <p className=" text-center heading border-bottom pb-3">
           {solutionName}
          </p>
          {categories?.length > 0 && (
            <>
              {role_id === 4 ? (
                <></>
              ) : (
                <div className="filter text-end mb-3 align-items-center">
                  {/* <SeconderyBtn
                        onClick={() => lockAllCategories()}
                      
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M14.9999 7.08333H14.1666V5.41667C14.1666 3.11667 12.2999 1.25 9.99992 1.25C7.69992 1.25 5.83325 3.11667 5.83325 5.41667V7.08333H4.99992C4.08325 7.08333 3.33325 7.83333 3.33325 8.75V17.0833C3.33325 18 4.08325 18.75 4.99992 18.75H14.9999C15.9166 18.75 16.6666 18 16.6666 17.0833V8.75C16.6666 7.83333 15.9166 7.08333 14.9999 7.08333ZM7.49992 5.41667C7.49992 4.03333 8.61659 2.91667 9.99992 2.91667C11.3833 2.91667 12.4999 4.03333 12.4999 5.41667V7.08333H7.49992V5.41667ZM14.9999 17.0833H4.99992V8.75H14.9999V17.0833ZM9.99992 14.5833C10.9166 14.5833 11.6666 13.8333 11.6666 12.9167C11.6666 12 10.9166 11.25 9.99992 11.25C9.08325 11.25 8.33325 12 8.33325 12.9167C8.33325 13.8333 9.08325 14.5833 9.99992 14.5833Z"
                            fill="var(--Colours-Primary-colour-Blue-500)"
                          />
                        </svg>
                        Lock all
                      </SeconderyBtn> */}
                  <SeconderyBtn
                    onClick={() => lockAllCategories()}
                      title="Lock All"
                  >
                    <svg style={{ marginRight: "5px" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M18 8.5H17V6.5C17 3.74 14.76 1.5 12 1.5C9.24 1.5 7 3.74 7 6.5V8.5H6C4.9 8.5 4 9.4 4 10.5V20.5C4 21.6 4.9 22.5 6 22.5H18C19.1 22.5 20 21.6 20 20.5V10.5C20 9.4 19.1 8.5 18 8.5ZM12 17.5C10.9 17.5 10 16.6 10 15.5C10 14.4 10.9 13.5 12 13.5C13.1 13.5 14 14.4 14 15.5C14 16.6 13.1 17.5 12 17.5ZM15.1 8.5H8.9V6.5C8.9 4.79 10.29 3.4 12 3.4C13.71 3.4 15.1 4.79 15.1 6.5V8.5Z" fill="var(--Colours-Primary-colour-Blue-500)" />
                    </svg>
                    Lock all
                  </SeconderyBtn>
                  <SeconderyBtn
                    onClick={() => unlockAllCategories()}
                      title="Unlock All"
                  >

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
                </div>
              )}
            </>
          )}

          <div className="row">
            <div className="col-12">
              {data?.length > 0 ? (
                <>
                  {data?.map((item: CategoryData, index: number) => (
                    <div
                      className="cards"
                      key={index}
                      onClick={() =>
                        navigate(
                          `/Home/Category/SubCategory/${solutionId}/${item?.cat_id}`
                        )
                      }
                    >
                      <h3 className="card-title ">{item?.cat_name}</h3>
                      <div className="d-flex align-items-center ">
                        <ProgressBar
                          progress={item?.answer_count}
                          maxValue={item?.question_count}
                        />
                        <span
                          style={{
                            color:
                              "var( --Colours-Typography-colours-Default---800)",
                          }}
                        >
                          {(
                            (item?.answer_count / item?.question_count) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>

                      <div className="d-flex category-card-action">
                        {/* <div className="text-center category-card-action-icon">
                          {mandatoryData?.map(
                            (
                              mandatoryItem: CategoryMandatoryDataInfo,
                              innerIndex: number
                            ) => (
                              <Fragment key={innerIndex}>
                                {mandatoryItem?.cat_id === item?.cat_id && (
                                  <>
                                    {getMantoryCount(
                                      mandatoryItem?.mandatory_answers_count,
                                      mandatoryItem?.mandatory_question_count,
                                      mandatoryfilter
                                    )}
                                  </>
                                )}
                              </Fragment>
                            )
                          )}
                        </div> */}
                        <div className="text-center category-card-action-icon">
                          <>
                            {categories[index]?.locked === 0 ? (
                              <>
                                <img
                                  style={{ cursor: "pointer" }}
                                  className="responsive-image"
                                  src={require(`../../assets/Icons/unLock.png`)}
                                  alt="lock"
                                  width={45}
                                  height={45}
                                  data-bs-toggle="tooltip" data-bs-placement="top" 
                                  title=""
                                  onClick={(e) => {
                                    if (role_id !== 4) {
                                      e.stopPropagation();
                                      lockFunc(
                                        categories[index]?.locked,
                                        categories[index]?.cat_id
                                      );
                                    }
                                  }}
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
                                  data-bs-toggle="tooltip" data-bs-placement="top" 
                                  title="Locked - Unable to Edit"
                                  onClick={(e) => {
                                    if (role_id !== 4) {
                                      e.stopPropagation();
                                      lockFunc(
                                        categories[index]?.locked,
                                        categories[index]?.cat_id
                                      );
                                    }
                                  }}
                                />
                                <p>Unlock</p>
                              </>
                            )}
                          </>
                        </div>

                        <div
                          className="text-center"
                          onClick={() =>
                            navigate(
                              // `/Home/${solutionId}/Category/SubCategory/${item?.cat_id}`
                              `/Home/Category/SubCategory/${solutionId}/${item?.cat_id}`
                            )
                          }
                        >
                          <img
                            style={{ cursor: "pointer" }}
                            className="responsive-image"
                            src={require(`../../assets/Icons/view.png`)}
                            alt="Visibility"
                          // width={45}
                          // height={45}
                          />
                          <p>View</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-5 mb-5 text-end">
                    <PrimaryBtn onClick={() => navigateSummary()} title="">
                      View Summary
                    </PrimaryBtn>
                  </div>
                </>
              ) : (
                <Loading />
              )}
            </div>
          </div>
          {showToastAllLock && (
            <Toast
              messages={lockUnlockMessage}
              onClose={() => setShowToastAllLock(false)}
            />
          )}
          {showToastLock && (
            <Toast
              messages={lockMessage}
              onClose={() => setShowToastLock(false)}
            />
          )}
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
};

export default Category;
