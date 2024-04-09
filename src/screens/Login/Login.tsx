import React, { useContext, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import crypto from "crypto-js";
import { stateContext } from "../../utills/statecontact";
import Toast from "../../common/Toast";
import PasswordInput from "../../common/PasswordInput";
import "../../styles/Login.scss";
import UseFetch from "../../utills/UseFetch";
import cookies from "js-cookie";
interface UserLoginInfo {
  email_id: string | null;
  password: string;
}

const Login: React.FC = () => {
  const [userLoginInfo, setUserLoginInfo] = useState<UserLoginInfo>({
    email_id: "",
    password: "",
  });
  const {
    dispatch,
    state: { token },
  } = useContext(stateContext);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forceLogout, setForceLogout] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    try {
      const userDataFromAPI = await axios.get(
        `/users/${userLoginInfo?.email_id}`
      );

      if (
        userDataFromAPI?.data?.length > 0 &&
        userDataFromAPI?.data[0]?.created_on
      ) {
        // const inputDateString = userDataFromAPI?.data[0]?.created_on;
        // const utcDate = inputDateString.slice(0, 19).replace("T", " ");
        // console.log(utcDate, "utcDate");

        // const hash = crypto
        //   .SHA512(userLoginInfo?.password + utcDate)
        //   .toString();

        const dateString = userDataFromAPI?.data[0]?.created_on;
        const dateObject = new Date(dateString);
        const formattedTime = `${dateObject.getFullYear()}-${String(
          dateObject.getMonth() + 1
        ).padStart(2, "0")}-${String(dateObject.getDate()).padStart(
          2,
          "0"
        )} ${String(dateObject.getHours()).padStart(2, "0")}:${String(
          dateObject.getMinutes()
        ).padStart(2, "0")}:${String(dateObject.getSeconds()).padStart(
          2,
          "0"
        )}`;
        const hash = crypto
          .SHA512(userLoginInfo?.password + formattedTime)
          .toString();

        const loginResponse = await axios.post(
          `/login`,
          {
            email_id: userLoginInfo?.email_id,
            passwd: hash,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (loginResponse.status === 200) {
          const userData = loginResponse?.data;
          if (userData.status === "Success") {
            const localTime = new Date();
            const logintime = `${String(localTime.getHours()).padStart(
              2,
              "0"
            )}:${String(localTime.getMinutes()).padStart(2, "0")}:${String(
              localTime.getSeconds()
            ).padStart(2, "0")}`;

            const userDetails = {
              isLoggedIn: true,
              logTime: logintime,
              ...userData,
            };
            sessionStorage.setItem("userDetails", JSON.stringify(userDetails));

            const userDataFromSession = sessionStorage.getItem("userDetails")
              ? JSON.parse(sessionStorage.getItem("userDetails")!)
              : null;
            if (userDataFromSession && userDataFromSession?.isLoggedIn) {
              dispatch({ type: "LOGIN", payload: true });
              dispatch({
                type: "USER_DATA",
                payload: userDataFromSession,
              });
              navigate("/");
            }
          } else {
            alert("Invalid Credentials");
          }
        } else {
          console.log(`Error logging in. Status: ${loginResponse?.status}`);
        }
      } else {
        // setErrorMessage(userDataFromAPI?.data)
        // console.log("User not found", userDataFromAPI);
        // handleShowToast("Something went wrong", "Failure");
      }
    } catch (error: any) {
      if (error) {
        if (error?.message === "Network Error") {
          const netWorkError: any = {
            statusCode: 500,
            status: "Failure",
            message: error?.message,
          };
          setErrorMessage(netWorkError);
        } else {
          setErrorMessage(error?.response?.data);
          if (error?.response?.data?.statusCode === 422) {
            setForceLogout(true);
            setUserId(error?.response?.data?.user_id);
            setRole(error?.response?.data?.role_id);
          }
        }
      } else {
        //   handleShowToast(error.response.data?.message, "Failure");
      }
    }
  };
  const toastRefresh = () => {
    setShowToast(false);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    try {
      // const inputDateString = new Date().toISOString();
      // const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      // const logOutPayload = {
      //   logout_time: utcDate,
      // };
      // await updateLogOutTime(logOutPayload, userId);
      // await cookieRomove();
      // const inputDateString = new Date().toISOString();
      // const utcDate = inputDateString.slice(0, 19).replace("T", " ");
      // const loginResponse = await axios.put(
      //   `/users/logout/${userId}`,
      //   {
      //     logout_time: utcDate,

      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //       role_id: role,
      //     },
      //     withCredentials: true,
      //   }
      // );
      const removecookies = await axios.patch(`/logout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          role_id: role,
        },
        withCredentials: true,
      });
      sessionStorage.clear();
      cookies.remove("jwt");
      dispatch({
        type: "LOGOUT",
      });
      setErrorMessage("");
      setForceLogout(false);
      setShowToast(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="login">
      <div className="login-container p-5">
        <div className="d-flex justify-content-center mt-2">
          {" "}
          {/* Centering the Logo */}
          <span className="h2 fw-bold mb-0">Login</span>
        </div>
        <h5
          className="fw-normal text-center my-4 pb-3"
          style={{ letterSpacing: "1px" }}
        >
          Sign into your account
        </h5>
        <Form onSubmit={handleClick}>
          <Form.Group className="mb-4">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              size="lg"
              onChange={(e) =>
                setUserLoginInfo({
                  ...userLoginInfo,
                  email_id: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <PasswordInput
              onChange={(e) =>
                setUserLoginInfo({
                  ...userLoginInfo,
                  password: e.target.value,
                })
              }
            />
          </Form.Group>
          <PrimaryBtn style={{ width: "100%" }} type="submit" title="">
            Login
          </PrimaryBtn>
          {showToast && (
            <Toast messages={errorMessage} onClose={() => toastRefresh()} />
          )}
        </Form>
      </div>
      <>
        {forceLogout && (
          <div className="force-popup">
            <div className="Popup">
              <h3 className="mb-4">Logout</h3>
              <h6>Are you sure you want to logout?</h6>
              <div className="text-end mt-5">
                <PrimaryBtn
                  onClick={() => setForceLogout(false)}
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
                  onClick={handleSubmit}
                  title=""
                >
                  Yes
                </PrimaryBtn>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Login;
