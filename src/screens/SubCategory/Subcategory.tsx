import React, { Fragment, useContext, useEffect } from "react";
import ProgressBar from "../../common/ProgressBar";
import { UseFetch } from "../../utills/UseFetch";
import { getMantoryCount } from "../../utills/CountFunc";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useNavigate, useParams } from "react-router-dom";
import { stateContext } from "../../utills/statecontact";
import Loading from "../../common/Loading";

interface SubCategoryData {
  solution_id: number;
  solution_name: string;
  category_id: number;
  cat_name: string;
  sub_cat_id: number;
  sub_cat_order_id: number;
  sub_cat_name: string;
  question_count: number;
  mandatory_question_count: number;
  answers_count: number;
  mandatory_answers_count: number;
  mandatory_filled_status: boolean;
}
interface SubCateMandatoryDataInfo {
  mandatory_filled_status: boolean;
  sub_cat_name: string;
  sub_cat_id: number;
  sub_cat_order_id: number;
  answers_count: number;
  mandatory_answers_count: number;
  mandatory_question_count: number;
}

const Subcategory: React.FC = () => {
  const {dispatch}=useContext(stateContext)
  const { solutionId, catId } = useParams();
  const navigate = useNavigate();
  const { data, error } = UseFetch(
    `/answers/subcategoriesStatus?solution_id=${solutionId}&category_id=${catId}`
  );
    const [subCat, setSubCat] = React.useState<SubCategoryData[]>([]);

    console.log(subCat, "subCat");
    

    const solutionName= subCat[0]?.solution_name
    console.log(solutionName, "solutionName");
    
    const catName= subCat[0]?.cat_name
    console.log(catName, "catName");
    

    useEffect(() => {
      setSubCat(data);
    },[data])
  const { data: mandatoryData } = UseFetch(
    `/answers/mandatoryStatus?solution_id=${solutionId}&category_id=${catId}`,
    "GET"
  );
/* The `mandatoryfilter` variable is used to determine if all the subcategories in the `mandatoryData`
array have a `mandatory_question_count` of 0. */
  const mandatoryfilter = mandatoryData?.every(
    (item: any) => item.mandatory_question_count === 0
  );
 
  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }

  return (
    <section id="category">
      <div className="row">
        <div className="col-12">
          { subCat?.length > 0 ? (
            <>
             <p className=" text-center heading border-bottom pb-3"><span className="ms-3"> {catName}</span></p>
              {subCat.map((item: SubCategoryData, index: number) => (
                <>
                <div className="cards" key={index}  onClick={() =>
                          navigate(
                            `/Home/Category/SubCategory/Inputs/${solutionId}/${catId}/${item?.sub_cat_id}/${item?.sub_cat_order_id}`
                          )
                        }>
                  <h3 className="card-title ">{item?.sub_cat_name}</h3>
                  <div className="d-flex align-items-center">
                    <ProgressBar
                      progress={item?.answers_count}
                      maxValue={item?.question_count}
                    />
                    <span
                      style={{
                        color:
                          "var( --Colours-Typography-colours-Default---800)",
                      }}
                    >
                      {item?.answers_count} / {item?.question_count}
                    </span>
                  </div>

                  <div className="d-flex category-card-action">
                    {/* <div className="text-center category-card-action-icon">
                      {mandatoryData?.map(
                        (
                          mandatoryItem: SubCateMandatoryDataInfo,
                          innerIndex: number
                        ) => (
                          <Fragment key={innerIndex}>
                            {mandatoryItem?.sub_cat_id === item?.sub_cat_id && (
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

                    <div className="text-center">
                      <img
                        style={{ cursor: "pointer" }}
                        className="responsive-image"
                        src={require(`../../assets/Icons/mode.png`)}
                        alt="edit"
                        width={45}
                        height={45}
                        onClick={() =>
                          navigate(
                            `/Home/Category/SubCategory/Answer/${solutionId}/${catId}/${item?.sub_cat_id}/${item?.sub_cat_order_id}`
                          )
                        }
                      />
                      <p>Edit</p>
                    </div>
                  </div>
                </div>
                </>
              ))}

              <div className="mt-5 text-end">
                <PrimaryBtn onClick={() => navigate(`/Home/Summary/${solutionId}`)}title=''>View Summary</PrimaryBtn>
              </div>
            </>
          ) : (
          <Loading/>
          )}
        </div>
      </div>
    </section>
  );
};

export default Subcategory;
