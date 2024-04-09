import React, { useReducer, useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Navbar from "./common/Navbar";
import "./App.scss";
import Category from "./screens/Category/Category";
import Subcategory from "./screens/SubCategory/Subcategory";
import Answer from "./screens/Answer/Answer";
import Login from "./screens/Login/Login";
import { initialState, stateReducer } from "./utills/stateReducer";
import { stateContext } from "./utills/statecontact";
import Summary from "./screens/Summary/Summary";
import Breadcrumb from "./common/Breadcrumb";
import Dashboard from "./screens/Dashboard/Dashboard";
import NetworkError from "./common/NetworkError";
import PageNotFound from "./common/PageNotFound";
import Setting from "./screens/Settings/Settings";
import Popup from "./common/Popup";
import cookies from "js-cookie";
import Versions from "./screens/Version/Version";
import CloudArchitecture from "./screens/CloudArchitecture/CloudArchitecture";
import VersionDetails from "./screens/Version/VersionDetails";
import SideBar from "./common/SideBar";
import Solutions from "./screens/solutions/Solutions";
import Loading from "./common/Loading";
import QuestionModel from "./screens/QuestionModel/QuestionModel";
import Help from "./screens/Help/Help";
import User_Profile from "./screens/Settings/User_Profile";
import DragAndDrop from "./common/DragAndDrop";

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  const [state, dispatch] = useReducer<React.Reducer<typeof initialState, any>>(
    stateReducer,
    initialState
  );
  const [showNetworkError, setShowNetworkError] = useState(false);

  const RouterLayout = () => {

/* convert to 20 minutes  from env file */
    const navigate = useNavigate();
    const autoLogoutString = process.env.REACT_APP_AUTO_LOGOUT;
    const autoLogout: any = autoLogoutString
      ? parseInt(autoLogoutString)
      : undefined;
    const autoLogoutMilliseconds = autoLogout * 60000;
    const watingTime = process.env.REACT_APP_WAIT_TIME;
    const watingTimeError: any = watingTime ? parseInt(watingTime) : undefined;

   /*user couldn't active in 20 minutes then it will logout */
    const resetLogoutTimer = () => {
      const timeoutId: NodeJS.Timeout = setTimeout(() => {
        const inputDateString = new Date().toISOString();
        const utcDate = inputDateString.slice(0, 19).replace("T", " ");
        const logOutPayload = {
          logout_time: utcDate,
        };

        const loginResponse = axios.put(
          `/users/logout/${state?.user_Data?.user_id}`,
          {
            logout_time: utcDate,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state?.token}`,
              role_id: state?.user_Data?.role,
            },
            withCredentials: true,
          }
        );
        const removecookies = axios.patch(`/logout`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state?.token}`,
            role_id: state?.user_Data?.role,
          },
          withCredentials: true,
        });
        cookies.remove("jwt");
        sessionStorage.clear();
        dispatch({
          type: "LOGOUT",
        });
        navigate("/");
      }, autoLogoutMilliseconds); 

      return timeoutId;
    };

 /* 
this is handle .this code user can't active in 20 minutes monitoring then this handle run
*/
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      const handleUserActivity = () => {
        // Reset the logout timer on user activity
        clearTimeout(timeoutId);
        timeoutId = resetLogoutTimer();
      };

      // Add event listeners for user activity
      document.addEventListener("mousemove", handleUserActivity);
      document.addEventListener("keydown", handleUserActivity);

      // Initialize the logout timer
      timeoutId = resetLogoutTimer();

      // Cleanup: remove event listeners on component unmount
      return () => {
        document.removeEventListener("mousemove", handleUserActivity);
        document.removeEventListener("keydown", handleUserActivity);
        clearTimeout(timeoutId);
      };
    }, []);

    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
      setShowSidebar(!showSidebar);
    };
    // const handleLogout = async () => {
    //   try {
    //     // const inputDateString = new Date().toISOString();
    //     // const utcDate = inputDateString.slice(0, 19).replace("T", " ");
    //     // const logOutPayload = {
    //     //   logout_time: utcDate,
    //     // };

    //     // await axios.put(
    //     //   `/users/logout/${state?.user_Data?.user_id}`,
    //     //   logOutPayload,
    //     //   {
    //     //     headers: {
    //     //       "Content-Type": "application/json",
    //     //       Authorization: `Bearer ${state?.token}`,
    //     //       role_id: state?.user_Data?.role,
    //     //     },
    //     //     withCredentials: true,
    //     //   }
    //     // );

    //     // await axios.patch(
    //     //   `/logout`,
    //     //   {},
    //     //   {
    //     //     headers: {
    //     //       "Content-Type": "application/json",
    //     //       Authorization: `Bearer ${state?.token}`,
    //     //       role_id: state?.user_Data?.role,
    //     //     },
    //     //     withCredentials: true,
    //     //   }
    //     // );
    //     cookies.remove("jwt");
    //     sessionStorage.clear();

    //     dispatch({
    //       type: "LOGOUT",
    //     });
    //     navigate("/");
    //   } catch (error) {
    //     console.error("Error during logout:", error);
    //   }
    // };


    // useEffect(() => {
    //   const handleStorageChange = (event: StorageEvent) => {
    //     if (event.key === "logout" && event.newValue !== null) {
    //       // Logout flag changed in localStorage, perform logout
    //       handleLogout();
    //     }
    //   };

    //   window.addEventListener("storage", handleStorageChange);

    //   // Broadcast logout event to other windows
    //   const broadcastChannel = new BroadcastChannel("logout_channel");
    //   broadcastChannel.postMessage({ type: "logout" });

    //   return () => {
    //     window.removeEventListener("storage", handleStorageChange);
    //     broadcastChannel.close();
    //   };
    // }, []);

    // useEffect(() => {
    //   const handleLogoutMessage = (event: MessageEvent) => {
    //     if (event.data.type === "logout") {
    //       // Logout event received from another window, perform logout
    //       handleLogout();
    //     }
    //   };

    //   const broadcastChannel = new BroadcastChannel("logout_channel");
    //   broadcastChannel.addEventListener("message", handleLogoutMessage);

    //   return () => {
    //     broadcastChannel.removeEventListener("message", handleLogoutMessage);
    //     broadcastChannel.close();
    //   };
    // }, []);
/* application duplicated time should be called in logout */
    useEffect(() => {
      const handleBeforeUnload = async () => {
        try {
          const inputDateString = new Date().toISOString();
          const utcDate = inputDateString.slice(0, 19).replace("T", " ");
          const logOutPayload = {
            logout_time: utcDate,
          };

          await axios.put(
            `/users/logout/${state?.user_Data?.user_id}`,
            logOutPayload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state?.token}`,
                role_id: state?.user_Data?.role,
              },
              withCredentials: true,
            }
          );

          await axios.patch(
            `/logout`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state?.token}`,
                role_id: state?.user_Data?.role,
              },
              withCredentials: true,
            }
          );

          cookies.remove("jwt");
          sessionStorage.clear();
        } catch (error) {
          console.error("Error during logout:", error);
        }
      };

      const handleUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = "";
        handleBeforeUnload();
      };

      window.addEventListener("unload", handleUnload);

      return () => {
        window.removeEventListener("unload", handleUnload);
      };
    }, []);

    useEffect(() => {
      const networkErrorTimeout = setTimeout(() => {
        setShowNetworkError(true);
      }, watingTimeError);

      return () => clearTimeout(networkErrorTimeout);
    }, []);

    return (
      <div className="app">
        {state?.networkError ? (
          <>
            {showNetworkError ? (
              <NetworkError />
            ) : (
              <div>
                <Loading />
              </div>
            )}
          </>
        ) : (
          <>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="container-fluid">
              <div className="row justify-content-around">
                <div className="col-lg-1 col-md-2">
                  <SideBar show={showSidebar} setShow={setShowSidebar} />
                </div>
                <div className="col-lg-11 col-md-10 offset-0 px-4 mt-5">
                  <Breadcrumb />
                  <div className="outLet">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
            {state?.popupData?.showPopup && <Popup />}
          </>
        )}
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: state?.isLogin ? <RouterLayout /> : <Login />,
      children: [
        {
          path: "/",
          element: state?.isLogin ? <Solutions /> : null,
        },
        {
          path: "/Dashboard",
          element: <Dashboard />,
        },
        {
          path: "/Home/Category/:solutionId",
          element: <Category />,
        },
        {
          path: "/Home/Category/SubCategory/:solutionId/:catId",
          element: <Subcategory />,
        },
        {
          path: "/Home/Category/SubCategory/Inputs/:solutionId/:catId/:subCatId/:subcatOrderId",
          element: <Answer />,
        },
        {
          path: "/Home/Summary/:solutionId",
          element: <Summary />,
        },

        {
          path: "IAM",
          element: <Setting />,
        },
        {
          path: "Profile",
          element: <User_Profile/>,
        },

        {
          path: "/Versions",
          element: <Versions />,
        },
        {
          path: "Versions/VersionDetails/:solution_id/:version_no",
          element: <VersionDetails />,
        },
        {
          path: "Home/CloudArchitecture/:solution_id",
          element: <CloudArchitecture />,
        },
        {
          path: "Questions",
          element: <QuestionModel/>,
        },
        {
          path: "Help",
          element: <Help />,
        },
        {
          path:'Drop',
          element:<DragAndDrop/>
        }
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return (
    <stateContext.Provider value={{ state, dispatch }}>
      <RouterProvider router={router} />
    </stateContext.Provider>
  );
}

export default App;

//Password@123

// Architect@123
