import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import PrimaryBtn from "./PrimaryBtn";
import crypto from "crypto-js";
import { validateFields } from "../utills/CountFunc";
import { UseFetch } from "../utills/UseFetch";
import infoImg from "../assets/Icons/info.png";
import "../styles/CreateUser.scss";

import PasswordInput from "./PasswordInput";
import Toast from "./Toast";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import PasswordChecklist from "react-password-checklist";

const Create_User = ({
  close,
  setUserInfo,
  userInfo,
  user_id,
  dispatch,
  formErrorMessage,
  setFormErrorMessage,
  errorMessage,
  setErrorMessage,
  showToast,
  setShowToast,
}: {
  close: any;
  setUserInfo: any;
  userInfo: any;
  user_id: any;
  dispatch: any;
  formErrorMessage: any;
  setFormErrorMessage: any;
  errorMessage: any;
  setErrorMessage: any;
  showToast: any;
  setShowToast: any;
}) => {
  const { apiCall: modelCreateApiCall, message: createMessage } = UseFetch(
    "/users",
    "POST",
    dispatch
  );

  const [passwordValid, setPasswordValid] = useState(false);

  useEffect(() => {
    const fieldErrors = validateFields(userInfo);
    setErrorMessage(fieldErrors);
  }, [userInfo]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const fieldErrors = await validateFields(userInfo);
      setFormErrorMessage(false);

      if (Object.keys(fieldErrors).length > 0) {
        setErrorMessage(fieldErrors);
        setFormErrorMessage(true);
        return;
      }

      if (!passwordValid) {
        setFormErrorMessage(true);
        setErrorMessage((prevErrors: any) => ({
          ...prevErrors,
          password: "Password must meet all criteria.",
        }));
        return;
      }

      // If password is valid, proceed with API call
      const inputDateString = new Date().toISOString();
      const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      const hash = crypto.SHA512(userInfo?.password + utcDate).toString();
      const createUserpayload = {
        user_name: userInfo?.user_name,
        passwd: hash,
        email_id: userInfo?.email_id,
        company_name: userInfo?.company_name,
        phone_num: userInfo?.phone_num,
        created_by: user_id,
        created_on: utcDate,
      };
      await modelCreateApiCall(createUserpayload);
    } catch (error) {
      console.log(error);
    }
    setShowToast(true);
  };

  return (
    <>
      <div id="CreateUser">
        <Form className="row" onSubmit={handleSubmit}>
          <h3 className="mb-4">Create User</h3>
          <Form.Group
            className={`mb-5 col-6 ${
              formErrorMessage && !userInfo?.user_name && "has-error"
            }`}
          >
            <Form.Control
              type="text"
              size="lg"
              name="name"
              value={userInfo?.user_name}
              placeholder="Enter Name"
              onChange={(e) => {
                setUserInfo({
                  ...userInfo,
                  user_name: e.target.value,
                });
                setFormErrorMessage(false); // Reset submitted state on input change
              }}
            />
            {formErrorMessage && !userInfo?.user_name && (
              <span className="invalid">
                <img
                  src={infoImg}
                  alt="info"
                  style={{ marginRight: "0.5rem" }}
                />
                {errorMessage?.user_name}
              </span>
            )}
          </Form.Group>

          <Form.Group
            className={`mb-5 col-6 ${
              formErrorMessage && !userInfo?.company_name && "has-error"
            }`}
          >
            <Form.Control
              type="text"
              size="lg"
              name="company_name"
              value={userInfo?.company_name}
              placeholder="Enter Company Name"
              onChange={(e) => {
                setUserInfo({
                  ...userInfo,
                  company_name: e.target.value,
                });
                setFormErrorMessage(false); // Reset submitted state on input change
              }}
            />
            {formErrorMessage && !userInfo?.company_name && (
              <span className="invalid">
                <img
                  src={infoImg}
                  alt="info"
                  style={{ marginRight: "0.5rem" }}
                />
                {errorMessage?.company_name}
              </span>
            )}
          </Form.Group>

          <Form.Group
            className={`mb-5 col-12 ${
              formErrorMessage && !userInfo?.email_id && "has-error"
            }`}
          >
            <Form.Control
              type="email"
              size="lg"
              name="email_id"
              value={userInfo?.email_id}
              placeholder="Enter Email Id"
              onChange={(e) => {
                setUserInfo({
                  ...userInfo,
                  email_id: e.target.value,
                });
                setFormErrorMessage(false); // Reset submitted state on input change
              }}
            />
            {formErrorMessage && !userInfo?.email_id && (
              <span className="invalid">
                <img
                  src={infoImg}
                  alt="info"
                  style={{ marginRight: "0.5rem" }}
                />
                {errorMessage?.email_id}
              </span>
            )}
          </Form.Group>

          <Form.Group
            className={`mb-5 col-6 ${
              formErrorMessage && !userInfo?.password && "has-error"
            }`}
          >
            <PasswordInput
              value={userInfo?.password}
              onChange={(e) => {
                setUserInfo({
                  ...userInfo,
                  password: e.target.value,
                });
                setFormErrorMessage(false);
              }}
              onValidationChange={setPasswordValid}
            />

            {userInfo?.password && (
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital"]}
                minLength={8}
                messages={{
                  minLength:
                    "The password should contain minimum 8 characters",
                  specialChar: "The password should have atleast one special character",
                  number: "The password should contain atleast 1 number",
                  capital: "The password should contain atleast one capital letter",
                }}
                value={userInfo?.password}
                onChange={(passwordIsValid) => {
                  setPasswordValid(passwordIsValid);
                }}
              />
            )}
            {formErrorMessage && !userInfo?.password && (
              <span className="invalid">
                <img
                  src={infoImg}
                  alt="info"
                  style={{ marginRight: "0.5rem" }}
                />
                The password should contain minimum 8 characters
              </span>
            )}
          </Form.Group>

          <Form.Group
            className={`col-6 ${formErrorMessage
              }`}
          >
            <PhoneInputWithCountrySelect
              style={{ padding: "1em 0 0 0" }} // Adjust the width of the input box as needed
              value={userInfo?.phone_num ? userInfo.phone_num + " " + userInfo.country_code : ""}
              defaultCountry="US"
              placeholder="Enter Phone Number"
              onChange={(value) => {
                if (value !== undefined) {
                  // Split the value into country code and phone number
                  const [phoneNumber, countryCode] = value.split(" ");
                  console.log("phoneNumber", phoneNumber);
                  console.log("countryCode", countryCode);

                  // Update userInfo with the extracted values
                  setUserInfo({
                    ...userInfo,
                    phone_num: phoneNumber,
                    country_code: countryCode, // Assuming there's a country_code field in userInfo
                  });

                  setFormErrorMessage(false); // Reset submitted state on input change
                }
              }}
            />
          </Form.Group>

          <div className="text-end">
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
        </Form>
        {showToast && <Toast messages={createMessage} onClose={() => close()} />}
      </div>
    </>
  );
};

export default Create_User;
