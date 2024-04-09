import React, { useContext } from "react";
import '../styles/NetworkError.scss';
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { stateContext } from "../utills/statecontact";
import { useNavigate } from "react-router-dom";
const PageNotFound = () => {
  const { state, dispatch } = useContext(stateContext);
  const navigate =useNavigate();
  return (
    <div className="container-fluid centered-container p-5 d-flex align-items-center justify-content-center">
      <Row className="g-0 p-5 rounded">
        <Col md="6">
          <img
            src={require("../assets/Icons/pagenot.jpg")}
            alt="networkerror"
            width={"100%"}
            height={"100%"}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        </Col>
        <Col
          md="6"
          className="rounded-end d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "white" }}
        >
          <div>
            <h1 className="fw-bold text-center ">Page Not Found</h1>
            <button
              onClick={() =>navigate(-1)
                // dispatch({
                //   type: "NETWORK_ERROR",
                //   payload: false,
                // })
              }
            >
              back to
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PageNotFound;
