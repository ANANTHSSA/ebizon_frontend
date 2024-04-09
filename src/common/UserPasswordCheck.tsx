import React, { useEffect, useState } from "react";
import PasswordInput from "./PasswordInput";
import PrimaryBtn from "./PrimaryBtn";
import wornImg from "../assets/Icons/info.png";
import crypto from "crypto-js";
import UseFetch from "../utills/UseFetch";
import Toast from "./Toast";
import ReactPasswordChecklist from "react-password-checklist";

interface ErrorMessage {
  password?: string;
  confirmPassword?: string;
}
const UserPasswordCheck = ({
  close,
  userInfo,
  dispatch,
  setUserInfo,
  user_id,
  setShowToast,
  showToast,
}: {
  close: any;
  userInfo: any;
  dispatch: any;
  setUserInfo: any;
  user_id: any;
  setShowToast: any;
  showToast: any;
}) => {
  const [newPassword, setNewPassword] = useState("");

  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<ErrorMessage>({});
  const { apiCall: modelEditApiCall, message: editMessage } = UseFetch(
    "/users",
    "PUT",
    dispatch
  );
  const handleNewPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
    setError({});
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
    setError({});
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (newPassword.length < 8) {
        setError({
          password: "The password should contain minimum 8 characters",
        });
        return;
      } else if (newPassword !== confirmPassword) {
        setError({
          confirmPassword: "New password and confirm password does not match",
        });
        return;
      }
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const hash = crypto.SHA512(confirmPassword + utcDate).toString();
      const editUserpayload = {
        user_name: userInfo?.user_name,
        passwd: hash,
        email_id: userInfo?.email_id,
        company_name: userInfo?.company_name,
        phone_num: userInfo?.phone_number,
        created_on: utcDate,
        updated_by: user_id,
        updated_on: utcDate,
      };

      await modelEditApiCall(editUserpayload, userInfo?.user_id);
      setShowToast(true);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3 className="mb-4">Reset Password</h3>

        <div>
          <label>New Password:</label>
          <PasswordInput
            value={newPassword}
            onChange={(e: any) => {
              handleNewPasswordChange(e);
            }}
            onValidationChange={setPasswordValid}
          />

          {newPassword && (
            <ReactPasswordChecklist
              rules={["minLength", "specialChar", "number", "capital"]}
              minLength={8}
              messages={{
                minLength: "The password should contain minimum 8 characters",
                specialChar:
                  "The password should have atleast one special character",
                number: "The password should contain atleast 1 number",
                capital:
                  "The password should contain atleast one capital letter",
              }}
              value={newPassword}
              onChange={(passwordIsValid) => {
                setPasswordValid(passwordIsValid);
              }}
            />
          )}
          {error?.password && (
            <p className="text-danger">
              <img
                src={wornImg}
                alt="wornImg"
                style={{ marginRight: "0.5rem" }}
              />
              {error?.password}
            </p>
          )}
        </div>
        <div className="mt-4">
          <label>Confirm Password:</label>
          <PasswordInput
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onValidationChange={setPasswordValid}
          />
        </div>
        {error?.confirmPassword && (
          <p className="text-danger">
            <img
              src={wornImg}
              alt="wornImg"
              style={{ marginRight: "0.5rem" }}
            />
            {error?.confirmPassword}
          </p>
        )}
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
          <PrimaryBtn style={{ marginLeft: "1rem" }} type="submit"title=''>
            Submit
          </PrimaryBtn>
        </div>
      </form>
      {showToast && <Toast messages={editMessage} onClose={() => close()} />}
    </>
  );
};

export default UserPasswordCheck;
