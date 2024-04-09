// import React from "react";
// import PropTypes from "prop-types";
// import "../styles/ProgressBar.scss";

// const ProgressBar = ({ progress, maxValue }) => {
//   const calculateWidth = () => {
//     // Calculate the width based on the progress and maxValue
//     const width = (progress / maxValue) * 100;
//     return `${width}%`;
//   };

//   const getColor = () => {
//     if (progress === 0) {
//       return "var(--Colours-Neutral-colours-Gray-100)"; // Set background color to red when progress is 0
//     } else if (progress >= maxValue) {
//       return "var(--Colours-System-colours-Success-500)"; // Set background color to green when progress equals or exceeds maxValue
//     } else if (progress >= maxValue / 2) {
//       return "var( --Colours-Secondary-colour-Purple-800)"; // Set background color to orange (#ff6300) when progress is halfway
//     } else {
//       return "var(--Colours-System-colours-Warning-500)"; // Default color for progress between 0 and halfway
//     }
//   };

//   const getBorderColor = () => {
//     if (progress < 0) {
//       return "1px solid red"; // Set border color to red when progress is 0
//     } else {
//       return "transparent"; // Set border color to transparent when progress is not 0
//     }
//   };

//   return (
//     <div className="progress-bar">
//       <div
//         className="progress-bar-inner"
//         style={{
//           width: calculateWidth(),
//           background: getColor(),
//           borderColor: getBorderColor(),
//           borderRadius: "6.25rem",
//         }}
//       ></div>
//     </div>
//   );
// };

// ProgressBar.propTypes = {
//   progress: PropTypes.number.isRequired,
//   maxValue: PropTypes.number.isRequired,
// };

// export default ProgressBar;

import React from "react";
import PropTypes from "prop-types";
import "../styles/ProgressBar.scss";

interface ProgressBarProps {
  progress: number;
  maxValue: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, maxValue }) => {
  const calculateWidth = () => {
    // Calculate the width based on the progress and maxValue
    const width = (progress / maxValue) * 100;
    return `${width}%`;
  };

  const getColor = () => {
    if (progress === 0) {
      return "var(--Colours-Neutral-colours-Gray-100)"; // Set background color to red when progress is 0
    } else if (progress >= maxValue) {
      return "var(--Colours-System-colours-Success-500)"; // Set background color to green when progress equals or exceeds maxValue
    } else if (progress >= maxValue / 2) {
      return "var(--Colours-Secondary-colour-Purple-800)"; // Set background color to orange (#ff6300) when progress is halfway
    } else {
      return "var(--Colours-System-colours-Warning-500)"; // Default color for progress between 0 and halfway
    }
  };

  const getBorderColor = () => {
    if (progress < 0) {
      return "1px solid red"; // Set border color to red when progress is 0
    } else {
      return "transparent"; // Set border color to transparent when progress is not 0
    }
  };

  return (
    <div className="progress-bar">
      <div
        className="progress-bar-inner"
        style={{
          width: calculateWidth(),
          background: getColor(),
          borderColor: getBorderColor(),
          borderRadius: "6.25rem",
        }}
      ></div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
};

export default ProgressBar;

