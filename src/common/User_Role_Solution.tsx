import React, { useState, useEffect } from "react";
import PrimaryBtn from "./PrimaryBtn";
import { UseFetch } from "../utills/UseFetch";
import RoleCheckBox from "./RoleCheckBox";
import { getRoleName } from "../utills/CountFunc";
import Toast from "./Toast";

const User_Role_Solution = ({
  close,
  user_id,
  role_id,
  dispatch,
  userInfo,
  setUserInfo,
  showToast,
  setShowToast,
}: {
  close: any;
  user_id: any;
  role_id: any;
  dispatch: any;
  userInfo: any;
  setUserInfo: any;
  showToast: any;
  setShowToast: any;
}) => {
  const { data, setRefetch: setRefetchSolution } = UseFetch(
    `/solutions?user_id=${user_id}&role_id=${role_id}&solution_page=${1}`,
    "GET",
    dispatch
  );
  const { apiCall: modelEditRoleApiCall, message: editRoleMessage } = UseFetch(
    "/users/solutions",
    "POST",
    dispatch
  );
  const userDataFromSession = sessionStorage.getItem("userDetails");
  const parsedUserData = userDataFromSession
    ? JSON.parse(userDataFromSession)
    : null;
  console.log("parsedUserData", parsedUserData);

  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (userInfo?.solutions && userInfo?.solutions.length > 0) {
      const userSolutionIds = userInfo?.solutions
        .map((solution: any) => solution?.solution_id)
        .filter((id: any) => id !== null && id !== undefined) as string[];

      setSelectedSolutions(userSolutionIds);
    } else {
      setSelectedSolutions([]);
    }
  }, [userInfo?.solutions]);

  const solutionIDsArray = data
    ?.map((item: any) => item.solutionIDsArray)
    .flat();

  const handleCheckboxChange = (solutionId: string) => {
    setSelectedSolutions((prevSelected) => {
      const isSelected = prevSelected.includes(solutionId);

      if (isSelected) {
        return prevSelected.filter((id) => id !== solutionId);
      } else {
        return [...prevSelected, solutionId];
      }
    });
  };
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const option = [
    {
      role_id: 3,
      role_name: "Architect",
    },
    {
      role_id: 4,
      role_name: "Engineer",
    },
  ];
  const handleRoleChange = (e: number) => {
    setUserInfo({
      ...userInfo,
      role_id: e,
    });
    setIsOpen(!isOpen);
  };

  const submitHandler = async () => {
    const inputDateString = new Date().toISOString();
    const utcDate = inputDateString.slice(0, 19).replace("T", " ");

    const editUserpayload = {
      user_id: userInfo?.user_id,
      role_id: userInfo?.role_id,
      solution_id: selectedSolutions,
      created_by: user_id,
      created_on: utcDate,
      updated_by: user_id,
      updated_on: utcDate,
    };

    await modelEditRoleApiCall(editUserpayload);
    setShowToast(true);
    if (parsedUserData) {
      parsedUserData.role_id = userInfo?.role_id;
    }
    sessionStorage.setItem("userDetails", JSON.stringify(parsedUserData));
  };

  return (
    <div>
      <h3 className="mb-4">User Roles & Solutions</h3>
      <div className="row">
        <div className="col-6">
          {data?.map((item: any, index: number) => (
            <React.Fragment key={index}>
              <p className="solution-label">Select Solutions</p>
              {item.solution?.map((subItem: any, subIndex: number) => {
                const isBlur = !solutionIDsArray.includes(subItem.solution_id);
                const isChecked = selectedSolutions.includes(
                  subItem.solution_id
                );
                return (
                  <div
                    key={subIndex}
                    className={`mb-3 ${isBlur ? "blur-image" : ""}`}
                  >
                    {isBlur ? (
                      <div className="input-box">
                        <label className="custom-checkbox">
                          <RoleCheckBox
                            type="checkbox"
                            readOnly
                            disabled
                            // value={subItem.solution_id}
                            // initialChecked={
                            //   isChecked ||
                            //   selectedSolutions.includes(subItem.solution_id)
                            // }
                            onChange={() =>
                              handleCheckboxChange(subItem.solution_id)
                            }
                            // disabled={isBlur}
                          />
                          <span></span>
                          {subItem.solution_name}
                        </label>
                      </div>
                    ) : (
                      <div className="input-box">
                        <label className="custom-checkbox">
                          <RoleCheckBox
                            type="checkbox"
                            value={subItem.solution_id}
                            initialChecked={
                              isChecked ||
                              selectedSolutions.includes(subItem.solution_id)
                            }
                            onChange={() =>
                              handleCheckboxChange(subItem.solution_id)
                            }
                            // disabled={isBlur}
                          />
                          <span></span>
                          {subItem.solution_name}
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="col-6">
          {data?.length > 0 && (
            <>
              <p className="solution-label">Select Role</p>
              <div className={`custom-dropdown ${isOpen ? "open" : ""}`}>
                <div>
                  <div
                    className="selected-option d-flex justify-content-between align-items-center"
                    onClick={handleToggleDropdown}
                  >
                    {userInfo?.role_id && userInfo?.role_id
                      ? getRoleName(userInfo?.role_id)
                      : "Select an option"}
                    <img
                      src={require("../assets/Icons/dropDown.png")}
                      width={24}
                      height={24}
                      alt="dropdown-icon"
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="options">
                    {option?.map((rol: any, index: number) => (
                      <div
                        className="option"
                        key={index}
                        onClick={() => handleRoleChange(rol?.role_id)}
                      >
                        {rol?.role_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {data?.length > 0 && (
          <div className="text-end">
            <PrimaryBtn
              onClick={() => close()}
              style={{
                background: "none",
                color: "var(--Colours-Primary-colour-Blue-500)",
                border: "1px solid var(--Colours-Primary-colour-Blue-500)",
              }}
              title=""
            >
              Cancel
            </PrimaryBtn>
            <PrimaryBtn
              style={{ marginLeft: "1rem" }}
              onClick={() => submitHandler()}
              title=""
            >
              Submit
            </PrimaryBtn>
          </div>
        )}
      </div>
      {showToast && (
        <Toast messages={editRoleMessage} onClose={() => close()} />
      )}
    </div>
  );
};

export default User_Role_Solution;
