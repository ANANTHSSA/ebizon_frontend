import React, { useContext } from "react";
import { stateContext } from "../../utills/statecontact";
import { UseFetch } from "../../utills/UseFetch";
import BarChart from "./BarChart";

const Dashboard = () => {
  const {
    state: {
      user_Data: { user_id },
    },
    dispatch,
  } = useContext(stateContext);

  const { data: dashBoard, error } = UseFetch(
    `answers/solutionStatus?user_id=${user_id}`,
    "GET",
    dispatch
  );
  console.log(dashBoard,"dashBoard");
  

  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }

  return (
    <section id="dashboard">
      <BarChart data={dashBoard} />
    </section>
  );
};

export default Dashboard;
