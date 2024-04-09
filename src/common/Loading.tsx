import React from "react";
import { FadeLoader } from "react-spinners";

const Loading = ({
  size = 40,
  color = "var( --Colours-Typography-colours-Default---500)",
  loading = true,
}) => {

  
  return (
    <div className="custom-moon-loader d-flex justify-content-center align-items-center" style={{width:" 100%", height:" 50vh"}}>
     
      <FadeLoader color={color} loading={loading} />
      {/* <h1 className="ms-3">waiting for few seconds</h1> */}
    </div>
  );
};

export default Loading;

