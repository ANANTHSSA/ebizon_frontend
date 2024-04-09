import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "../utills/statecontact";
import { UseFetch } from "../utills/UseFetch";
import { getRoleName } from "../utills/CountFunc";

const Navbar = ({ toggleSidebar }) => {
  const {
    state: {
      user_Data: { user_id },
    },
    dispatch,
  } = useContext(stateContext);
  const { data } = UseFetch("/users", "GET", dispatch);

  const [foundUser, setFoundUser] = useState(undefined);
  useEffect(() => {
    if (data) {
      setFoundUser(data.find((user) => user?.user_id === user_id));
    }
  }, [data, user_id]);

  const logOut = () => {
    const popupData = {
      showPopup: true,
      user: user_id,
      type: "Logout",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-md fixed-top"
        style={{
          boxShadow: "2px 2px 10px 0px rgba(20, 27, 46, 0.12)",
          height: "5rem",
          backgroundColor: "var(--Colours-Neutral-colours-White-10)",
          zIndex: 1000,
        }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler me-3"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className=" flex-grow-1 text-md-start text-sm-center text-lg-start text-xl-start text-xxl-start">
            <img
              src={require(`../assets/SidebarIcon/${process.env.REACT_APP_LOGO}`)}
              alt="logo_image"
              style={{ maxWidth: "200px", width: "100%" }}
            />
          </div>
          {/* <div className="d-none d-md-block me-5 ">
            <img
              src={require(`../assets/SidebarIcon/notifications_none.png`)}
              alt="notifications"
            />
          </div> */}
          <div className="me-2 ">
            <img
              src={require(`../assets/Icons/Type=Icon, Gender=Man.png`)}
              alt="profile"
              style={{ width: "60px", height: "60px" }}
            />
          </div>

          <div className="d-none d-md-block me-5">
            <div>
              <p
                style={{
                  marginBottom: "0",
                  color: "var(--Colours-Typography-colours-Default---800)",
                  fontFamily: "Medium-SemiBold",
                  fontSize: " 0.875rem",
                }}
              >
                {foundUser?.user_name}
              </p>
              <p
                style={{
                  marginBottom: "0",
                  color: "var(--Colours-Typography-colours-Default---500)",
                  fontSize: "0.75rem",
                }}
              >
                {getRoleName(foundUser?.role_id)}
              </p>
            </div>
          </div>
          <div className="d-none d-md-block ">
            <button
              className="d-flex align-items-center border-0 bg-transparent"
              onClick={() => logOut()}
              style={{ outline: "none" }}
            >
              <img
                src={require(`../assets/SidebarIcon/logout.png`)}
                alt="logout"
              />
              <span
                className="ms-2"
                style={{
                  color: "var(--Colours-System-colours-Alert-500)",
                  fontSize: "1rem",
                }}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
