import React, { useContext, useEffect, useState } from "react";
import "../styles/Popup.scss";
import { stateContext } from "../utills/statecontact";
import Create_User from "./Create_User";
import Edit_User from "./Edit_User";
import { UseFetch } from "../utills/UseFetch";
import User_Role_Solution from "./User_Role_Solution";
import Loading from "./Loading";
import User_Delete from "./User_Delete";
import UserPasswordCheck from "./UserPasswordCheck";
import Logout from "./Logout";
import ListMandatory from "./ListMandatory";
import Description from "./Description";
import CaFileUpload from "./CaFileUpload";
import CaVersion from "./CaVersion";
import Change_Password from "./Change_Password";
import CreateQuestion from "./CreateQuestion";
import EditQuestion from "./EditQuestion";
import DeleteQuestion from "./DeleteQuestion";
import D_A from "./D_A";
import C_P from "./C_P";

interface ErrorMessage {
  user_name?: string;
  company_name?: string;
  email_id?: string;
  password?: string;
  phone_number?: string;
}
const Popup = () => {
  const {
    state: {
      popupData: { user, type, solution_id, version_solution_id },
      user_Data: { user_id, role_id },
    },
    dispatch,
  } = useContext(stateContext);
  const [showToast, setShowToast] = useState(false);

  const { data: filterUser, setRefetch } = UseFetch(
    `/users?user_id=${user}`,
    "GET",
    dispatch
  );

  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (filterUser) {
      setUserInfo(filterUser[0]);
    }
  }, [filterUser]);

  const [formErrorMessage, setFormErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});

  const close = () => {
    sessionStorage.removeItem("Popup");
    dispatch({
      type: "POPUP",
      payload: {
        showPopup: false,
      },
    });
    setRefetch(true);
    setShowToast(false);
  };
  const renderPopupContent = () => {
    switch (type) {
      case "Create User":
        return (
          <div className="Popup-container">
            <div className="Popup">
              <Create_User
                close={close}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                user_id={user_id}
                dispatch={dispatch}
                formErrorMessage={formErrorMessage}
                setFormErrorMessage={setFormErrorMessage}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                showToast={showToast}
                setShowToast={setShowToast}
              />
            </div>
          </div>
        );
      case "Edit":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup">
                {Object.keys(filterUser).length > 0 ? (
                  <Edit_User
                    close={close}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    user_id={user_id}
                    dispatch={dispatch}
                    formErrorMessage={formErrorMessage}
                    setFormErrorMessage={setFormErrorMessage}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    showToast={showToast}
                    setShowToast={setShowToast}
                  />
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </>
        );
      case "User Roles & Solutions":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup">
                {Object.keys(filterUser).length > 0 ? (
                  <User_Role_Solution
                    close={close}
                    user_id={user_id}
                    role_id={role_id}
                    dispatch={dispatch}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    showToast={showToast}
                    setShowToast={setShowToast}
                  />
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </>
        );
      case "Delete":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup">
                {Object.keys(filterUser).length > 0 ? (
                  <User_Delete
                    close={close}
                    userInfo={userInfo}
                    dispatch={dispatch}
                    showToast={showToast}
                    setShowToast={setShowToast}
                  />
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </>
        );
      case "Password":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup1">
              {Object.keys(filterUser).length > 0 ? (
                <UserPasswordCheck
                  close={close}
                  userInfo={userInfo}
                  dispatch={dispatch}
                  setUserInfo={setUserInfo}
                  user_id={user_id}
                  setShowToast={setShowToast}
                  showToast={showToast}
                />):(<Loading/>)}
              </div>
            </div>
          </>
        );
        case "ChangePassword":
          return (
            <>
              <div className="Popup-container">
                <div className="Popup1">
                {Object.keys(filterUser).length > 0 ? (
                  <Change_Password
                    close={close}
                    userInfo={userInfo}
                    dispatch={dispatch}
                    setUserInfo={setUserInfo}
                    user_id={user_id}
                    setShowToast={setShowToast}
                    showToast={showToast}
                   
                  />):(<Loading/>)}
                </div>
              </div>
            </>
          );
      case "Logout":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup1">
                
                <Logout close={close} user_id={user_id} dispatch={dispatch} />
              </div>
            </div>
          </>
        );
      case "File_Upload":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup2">
                <CaFileUpload
                  close={close}
                  setShowToast={setShowToast}
                  showToast={showToast}
                />
              </div>
            </div>
          </>
        );
      case "Final_Version":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup3">
                <CaVersion
                  close={close}
                  setShowToast={setShowToast}
                  showToast={showToast}
                />
              </div>
            </div>
          </>
        );

      case "Summary":
        return (
          <>
            <div className="Popup-container">
              <div className="Popup">
                <ListMandatory
                  close={close}
                  setShowToast={setShowToast}
                  showToast={showToast}
                  solution_id={solution_id}
                  dispatch={dispatch}
                />
              </div>
            </div>
          </>
        );

      case "Description":
        return (
          <div className="Popup-container">
            <div className="Popup1">
              <Description
                close={close}
                version_solution_id={version_solution_id}
                dispatch={dispatch}
                user_id={user_id}
                showToast={showToast}
                setShowToast={setShowToast}
              />
            </div>
          </div>
        );
      case "CreateQuestion":
        return (
          <div className="Popup-container">
            <div className="Popup3">
              <CreateQuestion
                close={close}
                showToast={showToast}
                setShowToast={setShowToast}
              />
          
            </div>
          </div>
        );
        case "EditQuestion":
          return (
            <div className="Popup-container">
              <div className="Popup3">
                <EditQuestion
                  close={close}
                  showToast={showToast}
                  setShowToast={setShowToast}
                />
            
              </div>
            </div>
          );
          case "DeleteQuestion":
            return (
              <div className="Popup-container">
                <div className="Popup3">
                  <DeleteQuestion
                    close={close}
                    showToast={showToast}
                    setShowToast={setShowToast}
                  />
                </div>
              </div>
            );
            case "Cloud Discovery & Assessment":
              return (
                <div className="Popup-container">
                  <div className="solutions-container">
                    <D_A
                      close={close}
                      showToast={showToast}
                      setShowToast={setShowToast}
                      solution_id={solution_id}
                    />
                  </div>
                </div>
              );
                case "Cloud Planning":
                  return (
                    <div className="Popup-container">
                      <div className="solutions-container">
                        <C_P
                          close={close}
                          showToast={showToast}
                          setShowToast={setShowToast}
                          solution_id={solution_id}
                        />
                      </div>
                    </div>
                  )
      default:
        return <div></div>;
    }
  };

  return <>{renderPopupContent()}</>;
};

export default Popup;
