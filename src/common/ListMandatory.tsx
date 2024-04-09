import React from "react";
import PrimaryBtn from "./PrimaryBtn";
import UseFetch from "../utills/UseFetch";
import Loading from "./Loading";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ProgressBar from "./ProgressBar";

const ListMandatory = ({
  close,
  setShowToast,
  showToast,
  solution_id,
  dispatch,
}: {
  close: any;
  setShowToast: any;
  showToast: any;
  solution_id: any;
  dispatch: any;
}) => {
  const { data: mandatoryData } = UseFetch(
    `answers/mandatoryStatusSubCategory?solution_id=${solution_id}`,
    "GET"
  );


  const filterMandatory = (mandatoryData as any)?.categorieslist?.filter(
    (category: any) =>
      category.sub_category_list.some(
        (subCategory: any) => !subCategory.mandatory_filled_status
      )
  );
console.log(filterMandatory);

  
  const listMandatoryfun = () => {
    const mandatorydata = {
      mandatorystate: true,
      solution_id: solution_id,
    };
    const popupDataString = JSON.stringify(mandatorydata);
    sessionStorage.setItem("mandatory", popupDataString);
    dispatch({
      type: "MANDATORY",
      payload: mandatorydata,
    });
    close();
  };
  const mandatoryCount = (a:any,b:any)=>{
    return a-b;
  }

  return (
    <div className="list-mandatory">
      {filterMandatory?.length > 0 ? (
        <>
          <h3 className="mb-4">List of Mandatory Fields</h3>
          <div>
            {filterMandatory?.map((category: any, index: number) => (
              <div key={index} className="list-box">
                <h5> {category?.cat_name}</h5>
                {category.sub_category_list.map(
                  (subCategory: any, subIndex: number) => (
                    <div key={subIndex}>
                      {subCategory.mandatory_filled_status === false && (
                        <div className="row align-items-center mb-3">
                          <div className="col-6">
                          <p>{subCategory?.sub_cat_name}</p>
                            </div>
                            <div className="col-6">
                              <p>Mandatory Unanswer:<span>{mandatoryCount(subCategory?.mandatory_question_count,subCategory?.mandatory_answers_count)}</span></p>
                              </div>
                         
                          
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
          <div className="text-end mt-5">
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
            <PrimaryBtn
              style={{ marginLeft: "1rem" }}
              onClick={() => listMandatoryfun()}
              title=''
            >
              Submit
            </PrimaryBtn>
          </div>
          {/* {showToast && <Toast messages={} onClose={() => close()} />} */}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ListMandatory;
