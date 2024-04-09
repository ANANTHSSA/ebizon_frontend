import React, { useContext, useState } from "react";
import "../../styles/Solution.scss";
import { UseFetch } from "../../utills/UseFetch";
import { stateContext } from "../../utills/statecontact";
import Loading from "../../common/Loading";
import SolutionCard from "./SolutionCard";

const Solutions = () => {
  /* The code snippet is using the `useContext` hook to access the state and dispatch function from the
 `stateContext` context. */
  const {
    state: {
      user_Data: { user_id, role_id },
    },
    dispatch,
  } = useContext(stateContext);

  const { data, error } = UseFetch(
    `/solutions?user_id=${user_id}&role_id=${role_id}&solution_page=1`,
    "GET",
    dispatch
  );

  const [showToast, setShowToast] = useState(false);
  const close = () => {
    // setRefetch(true);
    setShowToast(false);
  };

  /* The line `const solutionIDsArray = data?.map((item) => item.solutionIDsArray).flat();` is creating
  an array called `solutionIDsArray` by mapping over the `data` array and extracting the
  `solutionIDsArray` property from each item. The `?.` operator is used to handle the case where
  `data` is `null` or `undefined`. The `flat()` method is then used to flatten the resulting array
  of arrays into a single array. */
  const solutionIDsArray = data?.map((item) => item.solutionIDsArray).flat();

  const sol_coming_soon = data?.map((item) => item.sol_coming_soon).flat();

  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }
  return (
    <section id="solutions">
      <div className="row">
        {data?.length > 0 ? (
          <>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                {item?.solution?.map((subItem, subIndex) => {
                  const isBlur = !solutionIDsArray.includes(
                    subItem.solution_id
                  );
                  return (
                    <SolutionCard
                      data={subItem}
                      index={subIndex}
                      key={subIndex}
                      isBlur={isBlur}
                      showToast={showToast}
                      setShowToast={setShowToast}
                      close={close}
                      sol_coming_soon={sol_coming_soon}
                      solIdArray={solutionIDsArray}
                      dispatch={dispatch}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </section>
  );
};

export default Solutions;
