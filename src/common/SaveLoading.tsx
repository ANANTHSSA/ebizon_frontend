import React from "react";
import { FadeLoader } from "react-spinners";

const SaveLoading = ({
  size = 30,
  color = "var( --Colours-Typography-colours-Default---500)",
  loading = true,
}) => {

  
  return (
    <div className="custom-moon-loader d-flex justify-content-center align-items-center" style={{width:" 100%", height:"50vh"}}>
      <FadeLoader color={color} loading={loading} />
    </div>
  );
};

export default SaveLoading;

