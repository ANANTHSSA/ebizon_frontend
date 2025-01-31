// import React, { useEffect, useState } from "react";
// import "../styles/Toast.scss";

// const Toast = ({ messages, onClose }: { messages: any; onClose: any }) => {
//   console.log("messages", messages);


//   const [showToast, setShowToast] = useState(true);

//   setTimeout(() => {
//     setShowToast(false);
//     onClose();
//   }, 3000);

//   const toastRender = () => {

//     switch (messages?.status) {
//       case "Success":
//         return (

//           <div className={`custom-toast ${messages?.status}`}>
//             <img
//               src={require("../assets/Icons/check_circle (1).png")}
//               alt="success"
//               width={25}
//               height={25}
//             />{" "}
//             {messages?.message}
//           </div>
//         );
//       case "Unauthorized":
//         return (
//           <div className={`custom-toast ${messages?.status}`}>
//             <img
//               src={require("../assets/Icons/error_outline.png")}
//               alt="success"
//               width={25}
//               height={25}
//             />{" "}
//             {messages?.message}
//           </div>
//         );
//       case "Failure":
//         return (
//           <div className={`custom-toast ${messages?.status}`}>
//             <img
//               src={require("../assets/Icons/error_outline.png")}
//               alt="success"
//               width={25}
//               height={25}
//             />{" "}
//             {messages?.message}
//           </div>
//         );
//       case "Alert":
//         return (
//           <div className={`custom-toast ${messages?.status}`}>
//             {/* <img
//               src={require("../assets/Icons/error_outline.png")}
//               alt="success"
//               width={25}
//               height={25}
//             />{" "} */}
//             <svg xmlns="http://www.w3.org/2000/svg" className="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#171717" />
//             </svg>
//             {messages?.message}
//           </div>
//         );
//     }
//   };

//   return <>{toastRender()}</>;
// };

// export default Toast;

import React, { useEffect, useState } from "react";
import Loading from "./Loading"; // Import the Loading component
import "../styles/Toast.scss";

const CloseToast = ({ messages, onClose }: { messages: any, onClose: any }) => {


    const [showToast, setShowToast] = useState(true);

    // useEffect(() => {
    //     // if (!messages) return; // If messages is null or undefined, return early

    //         setShowToast(false);
    //         onClose();


    // }, []);

    const toastRender = () => {
        if (!messages) return null; // If messages is null or undefined, return null

        switch (messages?.status) {
            // case "Success":
            //     return (
            //         <div className={`${messages?.status}`}>
            //             <img
            //                 src={require("../assets/Icons/check_circle (1).png")}
            //                 alt="success"
            //                 width={25}
            //                 height={25}
            //             />{" "}
            //             {messages?.message}
            //         </div>
            //     );
            // case "Unauthorized":
            //     return (
            //         <div className={` ${messages?.status}`}>
            //             <img
            //                 src={require("../assets/Icons/error_outline.png")}
            //                 alt="success"
            //                 width={25}
            //                 height={25}
            //             />{" "}
            //             {messages?.message}
            //         </div>
            //     );
            case "Failure":
                return (
                    <div className={`${messages?.status}`}>
                        <img
                            src={require("../assets/Icons/error_outline.png")}
                            alt="error"
                            width={25}
                            height={25}
                        />{" "}
                        {messages?.message}
                        <svg  className="ms-3" onClick={onClose} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="var(--Colours-System-colours-Alert-700)" />
                        </svg>
                    </div>
                );
            // case "Alert":
            //     return (
            //         <div className={`${messages?.status}`}>
            //             <svg xmlns="http://www.w3.org/2000/svg" className="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none">
            //                 <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#171717" />
            //             </svg>
            //             {messages?.message}
            //             <span className="ms-3" onClick={onClose} style={{ cursor: "pointer" }}>
            //                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            //                     <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#171717" />
            //                 </svg>
            //             </span>
            //         </div>
            //     );
            default:
                return null; // Handle unknown status
        }
    };

    if (!showToast) return null; // Hide the toast if showToast is false
    return (
        < >
            {messages ? <div className="custom-toast d-flex">
                {toastRender()}

            </div>
                : <div className="custom-toast"><Loading /></div>} {/* Render Loading if messages is null or undefined */}
        </>
    );
};

export default CloseToast;

