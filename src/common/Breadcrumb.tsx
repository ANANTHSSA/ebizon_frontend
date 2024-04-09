import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Breadcrumb.scss";
import { stateContext } from "../utills/statecontact";
import UseFetch from "../utills/UseFetch";
interface BreadcrumbProps { }

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const {
    state: {
      user_Data: { user_name, role_id, user_id },
    },
    dispatch,
  } = useContext(stateContext);
  const location = useLocation();

  // api call
  const { data } = UseFetch(
    `/solutions?user_id=${user_id}&role_id=${role_id}&solution_page=1`,
    "GET",
    dispatch
  );


  // split the solution array into two arrays
  const solutions = data?.map((item: any) => item.solution).flat();;


    // get the path and split it into segments based on '/' and filter out empty segments (leading or trailing slashes)   
  const pathLocal = sessionStorage.setItem("pathLocal", JSON.stringify(location?.pathname));
  const pathSegments = location?.pathname.split('/').filter((segment) => segment !== '');
  
  const navigate = useNavigate();
  const isNumber = (value: string) => !isNaN(Number(value));

  let numericSegments: string[] = [];
  let textSegments: string[] = [];

  // number and text segments will be stored in separate arrays

  pathSegments.forEach(segment => {
   

    if (!isNaN(Number(segment))) {


      numericSegments.push(segment);
    } else {
      textSegments.push(segment);
    }
  });


 
  const [solutionName, setSolutionName] = React.useState<any>();



  // get the solution name based on the solution_id

  function getSolution(id: string) {

    solutions?.forEach((item: any) => {
      if (item.solution_id == id) {
        setSolutionName(item.solution_name);
      }
    });
  }

  // Make sure to call getSolution inside a useEffect or another appropriate React hook
  React.useEffect(() => {
    getSolution(numericSegments[0]);
  }, [numericSegments]); // Make sure to specify the dependencies properly


  const handleBreadcrumbClick = (index: number) => {
    // If index is 0 and path starts with 'Solutions', navigate directly to '/Solutions'

    // index position wise navigation based on pathSegments
    if (index === 0 && pathSegments[0] === 'Home') {
;
      navigate('/');
    } else {

      // Navigate to the category path
      if (pathSegments[index] === "Category") {
        const targetPath = `/${textSegments[0]}/${textSegments[1]}/${numericSegments[0]}`
      
        navigate(targetPath);
      }
      else if (pathSegments[index] === "SubCategory") {
        // Navigate to the subcategory path
        const targetPath = `/${textSegments[0]}/${textSegments[1]}/${textSegments[2]}/${numericSegments[0]}/${numericSegments[1]}`
       
        navigate(targetPath);
      }
      else if (
        // navigate to the version path
     
        textSegments[index] === "Versions") {
        const targetPath = `/${textSegments[0]}`;
     
        navigate(targetPath);
      }
    }
  };

  if (pathSegments?.length >= 2) {
    return (
      <div className="Breadcrumb d-none d-md-block ps-3">
        <img src={require("../assets/Icons/arrowback.png")} alt="arrowback" style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
        {pathSegments.map((segment, index) => (
          <React.Fragment key={index}>
            {index === pathSegments.length - 1 ? (
              <h1>
                {index > 0 && (pathSegments[index - 1] === "Category")
                  ? "Overview"
                  : index > 0 && (pathSegments[index - 2] === "SubCategory")
                    ? `${solutionName}`
                    : (
                      pathSegments[index - 4] ? `${solutionName} ${pathSegments[index - 4]}` : (
                        <h1>
                          {pathSegments[1] == 'VersionDetails' ? 'Versions Details' :'Cloud Architecture'}
                        </h1>
                      )

                    )}
              </h1>
            ) : (
              <>
                {isNumber(segment?.replace(/^"(.*)"$/, '$1')) ? null : (
                  <>
                    {index > 0 && ' / '}
                    <span style={{ cursor: "pointer" }} onClick={() => handleBreadcrumbClick(index)}>{segment}</span>
                  </>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
  return (
    <div className="Breadcrumb d-none d-md-block ps-2">
      <div>
        {pathSegments?.length == 3 && (
       
          <div>
            <span onClick={() => navigate(-1)}>{pathSegments[0]}</span>
            <h1>{pathSegments[0]}</h1>
          </div>
        )}
        {pathSegments?.length === 0 && (
          <div>
            <span>Home</span>
            <h1>{user_name}</h1>
          </div>
        )}
        {pathSegments?.length === 1 && (
         
          <div>
            {/* <span>{pathSegments[0]}</span> */}
            <h1>{pathSegments[0]}</h1>
          </div>
        )}
        {pathSegments?.length === 2 && (
        

          <div>
            <span onClick={() => navigate(-1)}>{pathSegments[0]}</span>
            <h1>{pathSegments[1]}</h1>
          </div>
        )}

        <div className="text-end">
          <button className="d-inline me-5" onClick={() => navigate('/Drop')}>Drag & Drop</button>
        </div>

      </div>
    </div>
  );
};
export default Breadcrumb;
