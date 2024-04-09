import React, { useContext } from "react";
import "../styles/NetworkError.scss";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { stateContext } from "../utills/statecontact";
import SeconderyBtn from "./SeconderyBtn";
const NetworkError = () => {
  const { state, dispatch } = useContext(stateContext);
  return (
    <div className="container-fluid centered-container p-5 d-flex align-items-center justify-content-center">
      <Row className="g-0 p-5">
        <Col md="6">
          <img
            src={require("../assets/Icons/networkerror.jpg")}
            alt="networkerror"
            width={"100%"}
            height={"100%"}
          />
        </Col>
        <Col
          md="6"
          className="rounded-end d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "white" }}
        >
          <div>
            <h1
              className="fw-bold text-center "
              style={{ color: "var(--Colours-System-colours-Alert-700)" }}
            >
              {" "}
              NETWORK <br></br> ERROR<br></br> 404
            </h1>
            <div className="text-center mt-3">
              <SeconderyBtn
                onClick={() =>
                  dispatch({
                    type: "NETWORK_ERROR",
                    payload: false,
                  })
                }
              >
                <svg
                  className="me-2"
                  xmlns="
http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
                    <path d="M20 4v5h-5" />
                  </g>
                </svg>
                Refresh
              </SeconderyBtn>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NetworkError;
