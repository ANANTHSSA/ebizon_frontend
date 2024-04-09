import React, { useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import UseFetch from "../utills/UseFetch";
import cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
const Logout = ({
  close,
  user_id,
  dispatch,
}: {
  close: any;
  user_id: any;
  dispatch: any;
}) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const { apiCall: updateLogOutTime,message: logOut } = UseFetch("/users/logout", "PUT");
  const { apiCall: cookieRomove } = UseFetch("/logout", "PATCH");
  const handleSubmit = async () => {
    try {
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const logOutPayload = {
        logout_time: utcDate,
      };
      await updateLogOutTime(logOutPayload, user_id);
      await cookieRomove();
      sessionStorage.clear();
      cookies.remove("jwt");
      dispatch({
        type: "LOGOUT",
      });
      close();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h3 className="mb-4">Logout</h3>
      <h6>Are you sure you want to logout?</h6>
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
        <PrimaryBtn style={{ marginLeft: "1rem" }} onClick={handleSubmit}title=''>
          Yes
        </PrimaryBtn>
      </div>
      {showToast && (
        <Toast messages={logOut} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default Logout;
