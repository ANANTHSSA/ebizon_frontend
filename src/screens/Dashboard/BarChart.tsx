import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import RadioBtn from "../../common/RadioBtn";
import Loading from "../../common/Loading";

// Register the necessary modules (scales, tooltips, etc.)
Chart.register(...registerables);

interface BarchartProps {
  data: any;
}

const BarChart: React.FC<BarchartProps> = ({ data: dashBoard }) => {
  const [toggleValues, setToggleValues] = useState("all");

  const handleRadioChange = (value: any) => {
    setToggleValues(value);
  };

  const chartData = {
    labels: dashBoard?.map((item: any) => item?.solution_name),
    datasets: [
      {
        label: `Answered Questions${
          toggleValues === "mandatory" ? " Mandatory" : ""
        } (${toggleValues === "total" ? "Mandatory + " : ""}Answered) (%)`,
        data: dashBoard?.map((item: any) => {
          const answeredCount =
            toggleValues === "mandatory"
              ? item?.mandatory_acount
              : toggleValues === "total"
              ? item?.mandatory_acount + item?.answer_count
              : item?.answer_count;
          const totalCount =
            toggleValues === "mandatory"
              ? item?.mandatory_qcount
              : toggleValues === "total"
              ? item?.mandatory_qcount + item?.question_count
              : item?.question_count;

          const percentage =
            totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

          return percentage;
        }),
        backgroundColor: "#2A3E71",
        hoverBackgroundColor: "#2A3E71",
        hoverBorderColor: "#2A3E71",
        borderRadius: 10,
        barThickness: 100,
      },
      {
        label: `Unanswered Questions${
          toggleValues === "mandatory" ? " Mandatory" : ""
        } (${toggleValues === "total" ? "Mandatory + " : ""}Unanswered) (%)`,
        data: dashBoard?.map((item: any) => {
          const unansweredCount =
            toggleValues === "mandatory"
              ? item?.mandatory_unanswered
              : toggleValues === "total"
              ? item?.mandatory_unanswered + item?.unanswered_count
              : item?.unanswered_count;
          const totalCount =
            toggleValues === "mandatory"
              ? item?.mandatory_qcount
              : toggleValues === "total"
              ? item?.mandatory_qcount + item?.question_count
              : item?.question_count;

          const percentage =
            totalCount > 0 ? (unansweredCount / totalCount) * 100 : 0;

          return percentage;
        }),
        backgroundColor: "#C7CDDE",
        hoverBackgroundColor: "#C7CDDE",
        hoverBorderColor: "#C7CDDE",
        borderRadius: 10,
        barThickness: 100,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage",
          font: { size: 14, family: "Medium-Regular" },
        },
        ticks: {
          callback: function (value: any) {
            return value + "%";
          },
        },
        suggestedMin: 0,
      },
    },
    plugins: {
      legend: {
        title: {
          display: true,
          font: {
            size: 18,
            family: "Medium-Regular",
          },
        },
        labels: {
          font: {
            size: 14, // Adjust the font size for the legend labels
            family: "Medium-Regular",
          },
        },
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var currentValue = dataset.data[tooltipItem.index];
          return dataset.label + ": " + currentValue.toFixed(2) + "%";
        },
      },
    },
    height: 300,
  };

  return (
    <section id="chartbar" style={{ paddingRight: "4rem", paddingLeft: "4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "10px",
        }}
      >
        {/* <div style={{ marginRight: "10px" }}>
          <RadioBtn
            value="all"
            checked={toggleValues === "all"}
            onChange={() => handleRadioChange("all")}
          />
        </div>

        <RadioBtn
          value="mandatory"
          checked={toggleValues === "mandatory"}
          onChange={() => handleRadioChange("mandatory")}
        />

        <div className="d-none">
          <input
            style={{ marginRight: "10px" }}
            type="radio"
            value="total"
            checked={toggleValues === "total"}
            onChange={() => handleRadioChange("total")}
          />
          <label style={{ marginRight: "10px" }}>All</label>
        </div> */}
      </div>
     
        <Bar
          data={chartData}
          options={chartOptions}
          height={"33%"}
          width={"100%"}
          style={{
            background: "var(--box-background-color)",
            borderRadius: "var(--box-border-radius)",
            boxShadow: "var(--box-shadow-color)",
          }}
        />
    
    </section>
  );
};

export default BarChart;
