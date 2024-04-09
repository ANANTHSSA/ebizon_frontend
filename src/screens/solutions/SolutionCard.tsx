import React from "react";
import "../../styles/Solution.scss";
import { useNavigate } from "react-router-dom";
import Toast from "../../common/Toast";

interface solutionCardInf {
  solution_name: string;
  image: string;
  solution_id: number;
}
const SolutionCard = ({
  data,
  index,
  isBlur,
  sol_coming_soon,
  solIdArray,
  dispatch,
}: {
  data: solutionCardInf;
  index: number;
  isBlur: boolean;
  sol_coming_soon: any;
  solIdArray: any;
  dispatch: any;
}) => {
  const navigate = useNavigate();
  console.log(data);

  const [showToast1, setShowToast1] = React.useState(false);

  const [showToast2, setShowToast2] = React.useState(false);

  const toastMessage1 = () => {
    console.log("blur");
    setShowToast1(true);
  };

  const toastMessage2 = () => {
    console.log("not blur");
    setShowToast2(true);
  };

  const otherRoleMessage1 = {
    statusCode: 300,
    status: "Failure",
    message: "This solution is not purchased",
  };

  const otherRoleMessage2 = {
    statusCode: 300,
    status: "Alert",
    message: "Solution is coming soon",
  };
  // const onBoardingFun = (id: any, name: any) => {
  //   const popupData = {
  //     showPopup: true,
  //     solution_id: id,
  //     type: name,
  //   };
  //   const popupDataString = JSON.stringify(popupData);
  //   sessionStorage.setItem("Popup", popupDataString);
  //   dispatch({
  //     type: "POPUP",
  //     payload: popupData,
  //   });
  // };

  const onBoardingFun = (id: any, name: any) => {
    // Create an object containing data for a popup
    const popupData = {
      showPopup: true,    // A boolean indicating whether the popup should be displayed
      solution_id: id,    // An identifier for the solution associated with the popup
      type: name,         // A type identifier for the popup
    };

    // Convert the popupData object to a string
    const popupDataString = JSON.stringify(popupData);

    // Store the popupDataString in the sessionStorage under the key "Popup"
    sessionStorage.setItem("Popup", popupDataString);

    // Dispatch an action with type "POPUP" and payload containing the popupData
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
};

  return (
    <section
      className={`col-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4`}
      key={index}
    >
      {/* <ul className="list">  
   <li className="list-item">  
     <div className="list-content">    
      <h2>Title</h2>  
      <img src="" alt="" />  
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>  
      <a href="">Link</a>  
    </div>  
  </li>  
  <li className="list-item">  
    <div className="list-content">  
      
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>  
      <a href="">Link</a>  
    </div>  
  </li>  
  <li className="list-item">  
    <div className="list-content">  
      <h2>Title</h2>  
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>  
      <a href="">Link</a>  
    </div>  
  </li>  
  .
</ul> */}
 
{/* <div
  classNameName={`solution-box ${isBlur && "opacity-25"}`}
  data-bs-toggle="tooltip"
  data-bs-placement="top"
  title={
    isBlur
      ? otherRoleMessage1.message
      : !sol_coming_soon.includes(data?.solution_id)
      ? "Solution is available"
      : otherRoleMessage2.message
  }
>
  <div classNameName="row align-items-center">
    <div classNameName="col-12">
      <div classNameName="text-center">
        <img
      
          src={require(`../../assets/solutionImage/${data?.image}`)}
          alt="image"
          width={"100%"}
        />
      </div>
    </div>
  </div>
  <div classNameName="row align-items-end">
    <div classNameName="col-12">
  <div classNameName="row align-items-center">
     <div classNameName="col-10">
          {isBlur ? (
            <>
              <h4 onClick={toastMessage1} classNameName="solution-name text-center">
                {data?.solution_name}
              </h4>
            </>
          ) : !sol_coming_soon.includes(data?.solution_id) ? (
            data?.solution_id != 9 ? (
              <h4
                classNameName="solution-name text-center"
                onClick={() =>
                  onBoardingFun(data?.solution_id, data?.solution_name)
                }
              >
                {" "}
                {data?.solution_name}
              </h4>
            ) : (
              <h4
                classNameName="solution-name text-center"
                onClick={() =>
                  navigate(`Home/CloudArchitecture/${data.solution_id}`)
                }
              >
                {" "}
                {data?.solution_name}
              </h4>
            )
          ) : (
            <h4 classNameName="solution-name text-center" onClick={toastMessage2}>
              {" "}
              {data?.solution_name}
            </h4>
          )}
        </div>
        <div classNameName="col-2 ">
          {isBlur ? (
            <>
              <svg
              onClick={toastMessage1}
            classNameName="text-center"
            style={{ width: "2rem", height: " 2rem",cursor:"pointer"  }}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
              fill="#2A3E71"
            />
          </svg>
            </>
          ): !sol_coming_soon.includes(data?.solution_id) ?(
            data?.solution_id != 9 ? (
              <svg
 onClick={() =>
                  onBoardingFun(data?.solution_id, data?.solution_name)
                }
            classNameName="text-center"
            style={{ width: "2rem", height: " 2rem",cursor:"pointer"  }}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
              fill="#2A3E71"
            />
          </svg> 
            ):(
              <>
                <svg

   onClick={() =>
    navigate(`Home/CloudArchitecture/${data.solution_id}`)
  }
            classNameName="text-center"
            style={{ width: "2rem", height: " 2rem",cursor:"pointer"  }}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
              fill="#2A3E71"
            />
          </svg> 
              </>
            )
          ):(<>
          <svg
    onClick={toastMessage2}
            classNameName="text-center"
            style={{ width: "2rem", height: " 2rem",cursor:"pointer" }}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
              fill="#2A3E71"
            />
          </svg> 
          </>)}
        
        </div>
  </div>
    </div>
  </div>
</div> */}
{/* <div
  className={`solution-box ${isBlur && "opacity-25"}`}
  data-bs-toggle="tooltip"
  data-bs-placement="top"
  title={
    isBlur
      ? otherRoleMessage1.message
      : !sol_coming_soon.includes(data?.solution_id)
      ? "Solution is available"
      : otherRoleMessage2.message
  }
>
  <div className="row align-items-center">
    <div className="col-12">
      <div className="text-center" style={{ height: "300px" }}>
        <img
          src={require(`../../assets/solutionImage/${data?.image}`)}
          alt="image"
          width={"100%"}
          style={{ objectFit: "cover", height: "100%" }}
        />
      </div>
    </div>
  </div>
  <div className="row align-items-end">
    <div className="col-12">
      <div className="row align-items-center">
        <div className="col-10">
          {isBlur ? (
            <>
              <h4 onClick={toastMessage1} className="solution-name text-center">
                {data?.solution_name}
              </h4>
            </>
          ) : !sol_coming_soon.includes(data?.solution_id) ? (
            data?.solution_id != 9 ? (
              <h4
                className="solution-name text-center"
                onClick={() =>
                  onBoardingFun(data?.solution_id, data?.solution_name)
                }
              >
                {" "}
                {data?.solution_name}
              </h4>
            ) : (
              <h4
                className="solution-name text-center"
                onClick={() =>
                  navigate(`Home/CloudArchitecture/${data.solution_id}`)
                }
              >
                {" "}
                {data?.solution_name}
              </h4>
            )
          ) : (
            <h4 className="solution-name text-center" onClick={toastMessage2}>
              {" "}
              {data?.solution_name}
            </h4>
          )}
        </div>
        <div className="col-2">
          {isBlur ? (
            <>
              <svg
                onClick={toastMessage1}
                className="text-center"
                style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                  fill="#2A3E71"
                />
              </svg>
            </>
          ) : !sol_coming_soon.includes(data?.solution_id) ? (
            data?.solution_id != 9 ? (
              <svg
                onClick={() =>
                  onBoardingFun(data?.solution_id, data?.solution_name)
                }
                className="text-center"
                style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                  fill="#2A3E71"
                />
              </svg>
            ) : (
              <svg
                onClick={() =>
                  navigate(`Home/CloudArchitecture/${data.solution_id}`)
                }
                className="text-center"
                style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                  fill="#2A3E71"
                />
              </svg>
            )
          ) : (
            <svg
              onClick={toastMessage2}
              className="text-center"
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                fill="#2A3E71"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  </div>
</div> */}
<div
  className={`solution-box ${isBlur && "opacity-25"}`}
  data-bs-toggle="tooltip"
  data-bs-placement="top"
  title={
    isBlur
      ? otherRoleMessage1.message
      : !sol_coming_soon.includes(data?.solution_id)
      ? "Solution is available"
      : otherRoleMessage2.message
  }
>
  <div className="row align-items-center">
    <div className="col-12">
      <div className="text-center" style={{ height: "18rem" }}>
        <img
          src={require(`../../assets/solutionImage/${data?.image}`)}
          alt="image"
          width={"100%"}
          style={{ objectFit: "cover", height: "100%" }}
        />
      </div>
    </div>
  </div>
  <div className="row align-items-end">
    <div className="col-12">
      <div className="row mt-5" style={{ height: "10rem" }}>
        <div className="col-10 d-flex ">
          {isBlur ? (
            <>
              <h4 onClick={toastMessage1} className="solution-name text-center flex-grow-1">
                {data?.solution_name}
              </h4>
            </>
          ) : !sol_coming_soon.includes(data?.solution_id) ? (
            data?.solution_id != 9 ? (
              <h4
                className="solution-name text-center flex-grow-1"
                onClick={() =>
                  onBoardingFun(data?.solution_id, data?.solution_name)
                }
              >
                {" "}
                {data?.solution_name}
              </h4>
            ) : (
              <h4
                className="solution-name text-center flex-grow-1"
                onClick={() =>
                  navigate(`Home/CloudArchitecture/${data.solution_id}`)
                }
              >
                {" "}
                {data?.solution_name}
              </h4>
            )
          ) : (
            <h4 className="solution-name text-center flex-grow-1" onClick={toastMessage2}>
              {" "}
              {data?.solution_name}
            </h4>
          )}
        </div>
        <div className="col-2">
          {isBlur ? (
            <>
              <svg
                onClick={toastMessage1}
                className="text-center"
                style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                  fill="#2A3E71"
                />
              </svg>
            </>
          ) : !sol_coming_soon.includes(data?.solution_id) ? (
            data?.solution_id != 9 ? (
              <svg
                onClick={() =>
                  onBoardingFun(data?.solution_id, data?.solution_name)
                }
                className="text-center"
                style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                  fill="#2A3E71"
                />
              </svg>
            ) : (
              <svg
                onClick={() =>
                  navigate(`Home/CloudArchitecture/${data.solution_id}`)
                }
                className="text-center"
                style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                  fill="#2A3E71"
                />
              </svg>
            )
          ) : (
            <svg
              onClick={toastMessage2}
              className="text-center"
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.41671 4.58334V6.25H12.575L4.58337 14.2417L5.75837 15.4167L13.75 7.425V14.5833H15.4167V4.58334H5.41671Z"
                fill="#2A3E71"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  </div>
</div>




      {showToast1 && (
        <Toast
          messages={otherRoleMessage1}
          onClose={() => setShowToast1(false)}
        />
      )}
      {showToast2 && (
        <Toast
          messages={otherRoleMessage2}
          onClose={() => setShowToast2(false)}
        />
      )}
    </section>
  );
};

export default SolutionCard;
