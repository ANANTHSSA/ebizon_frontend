import React, { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import SeconderyBtn from "../../common/SeconderyBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import UseFetch from "../../utills/UseFetch";
import Toast from "../../common/Toast";
import { stateContext } from "../../utills/statecontact";
import "../../styles/Settings.scss";
import Loading from "../../common/Loading";

interface UserData {
  user_name: string;
  email_id: string;
  phone_num: string;
  role_id: string;
  company_name: string;
  phone_number: string;
  user_id: string;
  solutions: any[]; // Adjust type as per your actual data structure
}
const User_Profile = () => {
  const {
    state: {
      user_Data: { user_id },
      popupData,
    },
    dispatch,
  } = useContext(stateContext);
  const { data, setRefetch: setRefetchUser,error } = UseFetch(
    '/users',
    "GET",
    dispatch
  );
 
  

  const [edit, setEdit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const userDataFromSession = sessionStorage.getItem("userDetails");
  const parsedUserData = userDataFromSession ? JSON.parse(userDataFromSession) : null;
  const [userInfo, setUserInfo] = useState<UserData>({
    user_name: "",
    email_id: "",
    phone_num: "",
    role_id: "",
    company_name: "",
    phone_number: "",
    user_id: "",
    solutions: [],
  });
  
  useEffect(() => {
    // Check if data is available before setting userInfo
    if (data) {
      let filterUser: UserData = data.find((item: any) => item.user_id === user_id) || {
        user_name: "",
        email_id: "",
        phone_num: "",
        phone_number: "",
        role_id: "",
        company_name: "",
        user_id: "",
        solutions: [],
      };
  
      setUserInfo({
        user_name: filterUser.user_name || "",
        email_id: filterUser.email_id || "",
        phone_num: filterUser.phone_num || "",
        role_id: filterUser.role_id || "",
        company_name: filterUser.company_name || "",
        phone_number: filterUser.phone_num || "",
        user_id: filterUser.user_id || "",
        solutions: filterUser.solutions || [],
      });
    }
  }, [data]);
 
  
  const { apiCall: modelEditApiCall, message: editMessage } = UseFetch(
    "/users",
    "PUT",
    dispatch
  );
  const editProfileNamFun = () => {
    setEdit(!edit);
  };
  const editProfileNamFunSave = async () => {
    const inputDateString = new Date().toISOString();
    const utcDate = inputDateString.slice(0, 19).replace("T", " ");
    const editUserpayload = {
      user_name: userInfo?.user_name,
      email_id: userInfo?.email_id,
      company_name: userInfo?.company_name,
      phone_num: userInfo?.phone_number,
      updated_by: user_id,
      updated_on: utcDate,
    };
    await modelEditApiCall(editUserpayload, userInfo?.user_id);
    setEdit(!edit);
    setShowToast(true);
    if(parsedUserData){
      parsedUserData.user_name =userInfo?.user_name ;
    }
    sessionStorage.setItem("userDetails", JSON.stringify(parsedUserData));
  };
  const editProfilePAssword = (userId: any) => {
    console.log("userId", userId);

    const popupData = {
      showPopup: true,
      user: userId,
      type: "Password",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };

  return (
    <section id="settings">
      {data?.length > 0 ? (
    <section className="user-profile">
    <div className="user-profile-container  mt-5">
      <p className="mb-0 setting-heading">Profile</p>

      <div className="row">
        <div className="col-3">
          <img
            src={require("../../assets/Icons/Type=Icon, Gender=Man.png")}
            width={100}
            height={100}
            alt="profile"
          />
        </div>
        <div className="col-9">
          <table className="table">
            <tbody>
              <tr className="align-middle">
                <th>Name</th>
                <td>
                  {edit ? (
                    <Form.Control
                      type="text"
                      value={userInfo?.user_name}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          user_name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    userInfo?.user_name
                  )}
                </td>
                <td>
                  {edit ? (
                    <SeconderyBtn onClick={() => editProfileNamFunSave()}>
                      <img
                        src={require("../../assets/Icons/edit.png")}
                        width={25}
                        height={25}
                        alt="lock"
                      />
                      Save
                    </SeconderyBtn>
                  ) : (
                    <SeconderyBtn onClick={() => editProfileNamFun()}>
                      <img
                        src={require("../../assets/Icons/edit.png")}
                        width={25}
                        height={25}
                        alt="lock"
                      />
                      Edit
                    </SeconderyBtn>
                  )}
                </td>
              </tr>
              <tr className="align-middle">
                <th>Email</th>
                <td>{userInfo?.email_id}</td>
              </tr>
              <tr className="align-middle">
                <th>Solutions</th>
                <td>
                  {userInfo?.solutions?.map(
                    (solution: any, solIndex: number) => (
                      <span key={solIndex} className="access-item">
                        {solution.solution_name ?? "No Solution Name"}
                      </span>
                    )
                  )}
                </td>
              </tr>
              <tr className="align-middle">
                <th>Password</th>
                <td>
                  <PrimaryBtn onClick={() => editProfilePAssword(user_id)}title=''>
                    Reset Password
                  </PrimaryBtn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {showToast && (
      <Toast messages={editMessage} onClose={() => setShowToast(false)} />
    )}
  </section> 
      ):(  
        <Loading/>
         )}
 
    </section>
  );
};

export default User_Profile;
