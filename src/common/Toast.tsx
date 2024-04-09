

// // import React, { useEffect, useState } from "react";
// // import Loading from "./Loading"; // Import the Loading component
// // import "../styles/Toast.scss";

// // const Toast = ({ messages, onClose }: { messages: any; onClose: any }) => {


// //   const [showToast, setShowToast] = useState(true);

// //   useEffect(() => {
// //     if (!messages) return; // If messages is null or undefined, return early
// //     const timer = setTimeout(() => {
// //       setShowToast(false);
// //       onClose();
// //     },3000 );
// //     return () => clearTimeout(timer);
// //   }, [messages, onClose]);

// //   const toastRender = () => {
// //     if (!messages) return null; // If messages is null or undefined, return null

// //     switch (messages?.status) {
// //       case "Success":
// //         return (
// //           <div className={`${messages?.status}`}>
// //             <img
// //               src={require("../assets/Icons/check_circle (1).png")}
// //               alt="success"
// //               width={25}
// //               height={25}
// //             />{" "}
// //             {messages?.message}
// //           </div>
// //         );
// //       case "Unauthorized":
// //                 return (
// //           <div className={` ${messages?.status}`}>
// //             <img
// //               src={require("../assets/Icons/error_outline.png")}
// //               alt="success"
// //               width={25}
// //               height={25}
// //             />{" "}
// //             {messages?.message}
// //           </div>
// //         );
// //       case "Failure":
// //         return (
// //           <div className={`${messages?.status}`}>
// //             <img
// //               src={require("../assets/Icons/error_outline.png")}
// //               alt="error"
// //               width={25}
// //               height={25}
// //             />{" "}
// //             {messages?.message}
// //           </div>
// //         );
// //       case "Alert":
// //         return (
// //           <div className={`${messages?.status}`}>
// //             <svg xmlns="http://www.w3.org/2000/svg" className="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none">
// //               <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#171717" />
// //             </svg>
// //             {messages?.message}
// //           </div>
// //         );
// //       default:
// //         return null; // Handle unknown status
// //     }
// //   };

// //   if (!showToast) return null; // Hide the toast if showToast is false
// //   return (
// //     < >
// //       {messages ? (<div className="custom-toast">{toastRender()}</div>)
// //        : <div className="custom-toast"><Loading /></div>} {/* Render Loading if messages is null or undefined */}
// //     </>
// //   );
// // };

// // export default Toast;

// import React, { useEffect, useState } from "react";
// import Loading from "./Loading";
// import "../styles/Toast.scss";

// const Toast = ({ messages, onClose }: { messages: any; onClose: any }) => {
//   const [showToast, setShowToast] = useState(true);
//   const [progress, setProgress] = useState(100); // Progress bar starts at 100%
//   const [countdown, setCountdown] = useState(3); // Countdown starts at 3 seconds

//   useEffect(() => {
//     if (!messages) return;
//     const timer = setTimeout(() => {
//       setShowToast(false);
//       onClose();
//     }, countdown * 1000); // Close toast after countdown seconds
//     return () => clearTimeout(timer);
//   }, [messages, onClose, countdown]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prevProgress) => prevProgress - (1 / countdown) * 100); // Decrease progress every second
//       setCountdown((prevCountdown) => prevCountdown - 1); // Decrease countdown every second
//     }, 1000); // Update progress and countdown every second
//     return () => clearInterval(interval);
//   }, [countdown]);

//   const toastRender = () => {
//     if (!messages) return null;

//     switch (messages?.status) {
//       case "Success":
//         return (
//           <div className={`${messages?.status}`}>
//             <img
//               src={require("../assets/Icons/check_circle (1).png")}
//               alt="success"
//               width={25}
//               height={25}
//             />
//             {messages?.message}
//             {countdown} 
//           </div>
//         );
//       case "Unauthorized":
//         return (
//           <div className={` ${messages?.status}`}>
//             <img
//               src={require("../assets/Icons/error_outline.png")}
//               alt="success"
//               width={25}
//               height={25}
//             />
//             {messages?.message}
//             {countdown} 
//           </div>
//         );
//       case "Failure":
//         return (
//           <div className={`${messages?.status}`}>
//             <img
//               src={require("../assets/Icons/error_outline.png")}
//               alt="error"
//               width={25}
//               height={25}
//             />
//             {messages?.message}
//             {countdown} 
//           </div>
//         );
//       case "Alert":
//         return (
//           <div className={`${messages?.status}`}>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="me-2"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//             >
//               <path
//                 d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
//                 fill="#171717"
//               />
//             </svg>
//             {messages?.message}
//             {countdown} 
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   if (!showToast) return null;

//   return (
//     <>
//       {messages ? (
//         <div className="custom-toast">
//           {toastRender()}
//           <div className="progress-bar-container">
//             <div
//               className="progress-bar"
//               style={{ width: `${progress}%` }}
//             ></div>
//             <div className="progress-text">{countdown} seconds left</div>
//           </div>
//         </div>
//       ) : (
//         <div className="custom-toast">
//           <Loading />
//         </div>
//       )}
//     </>
//   );
// };

// export default Toast;
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import "../styles/Toast.scss";

const Toast = ({ messages, onClose }: { messages: any; onClose: any }) => {
  const [showToast, setShowToast] = useState(true);
  const [progress, setProgress] = useState(100); // Progress bar starts at 100%
  const [countdown, setCountdown] = useState(3); // Countdown starts at 3 seconds

  useEffect(() => {
    if (!messages) return;
    const timer = setTimeout(() => {
      setShowToast(false);
      onClose();
    }, countdown * 1000); // Close toast after countdown seconds
    return () => clearTimeout(timer);
  }, [messages, onClose, countdown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress > 0) {
          return prevProgress - (100 / (countdown * 10)); // Smooth decrease of progress every 100ms
        }
        return prevProgress;
      });
      setCountdown((prevCountdown) => prevCountdown - 0.1); // Decrease countdown every 100ms
    }, 100); // Update progress and countdown every 100ms
    return () => clearInterval(interval);
  }, [countdown]);

  const toastRender = () => {
    if (!messages) return null;

    switch (messages?.status) {
      case "Success":
        return (
          <div className={`${messages?.status}`}>
            <img
              src={require("../assets/Icons/check_circle (1).png")}
              alt="success"
              width={25}
              height={25}
            />
            {messages?.message}
          </div>
        );
      case "Unauthorized":
        return (
          <div className={` ${messages?.status}`}>
            <img
              src={require("../assets/Icons/error_outline.png")}
              alt="success"
              width={25}
              height={25}
            />
            {messages?.message}
          </div>
        );
      case "Failure":
        return (
          <div className={`${messages?.status}`}>
            <img
              src={require("../assets/Icons/error_outline.png")}
              alt="error"
              width={25}
              height={25}
            />
            {messages?.message}
          </div>
        );
      case "Alert":
        return (
          <div className={`${messages?.status}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill="#171717"
              />
            </svg>
            {messages?.message}
          </div>
        );
      default:
        return null;
    }
  };

  if (!showToast) return null;

  return (
<>
  {messages ? (
    <div className="custom-toast">
      {toastRender()}
      {/* <div className="mt-2 progress-bar-container d-flex align-items-center" >
      <div className="me-2 progress-text">{countdown.toFixed(1)}</div>
        <div
          className={` ${messages?.status}`}
          style={{ width: `${progress}%` }}
        ></div>
        
      </div> */}
    </div>
  ) : (
    <div className="custom-toast">
      <Loading />
    </div>
  )}
</>


  );
};

export default Toast;

