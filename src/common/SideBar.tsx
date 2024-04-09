import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../src/styles/Sidebar.scss";
import { useLocation } from "react-router-dom";
import UseFetch from "../utills/UseFetch";
import { stateContext } from "../utills/statecontact";
interface CategoryData {
  role_id: number;
}
const SideBar = ({ show, setShow }: { show: any; setShow: any }) => {
  const sidebarClasses = show
    ? "d-flex justify-content-start sidebar"
    : "d-none d-md-block sidebar";
  const location = useLocation();
  const pathSegments = location.pathname
    ?.split("/")
    .filter((segment) => segment !== "");

  console.log("pathSegments", pathSegments[0]);

  const {
    state: {
      user_Data: { user_id },
      popupData,
    },
    dispatch,
  } = useContext(stateContext);
  const { data: userRole, setRefetch: userRoleRefetch } = UseFetch(
    `/users?user_id=${user_id}`,
    "GET",
    dispatch
  );
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [role_id, setRoleId] = useState<number | undefined>(4); // Initialize role_id with 4

  useEffect(() => {
    setCategories(userRole);
  }, [userRole]);

  useEffect(() => {
    if (categories.length > 0) {
      setRoleId(categories[0]?.role_id);
    }
  }, [categories]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShow(false);
    }
  }, [setShow]);

  const sidebarRouter = [
    {
      topRouter: [
        {
          route: "Home",
          icon: "home.png",
        },
        {
          route: "Dashboard",
          icon: "dashboard.png",
        },
        {
          route: "Versions",
          icon: "inventory_2.png",
        },
      ],
      roleWiseRouter: [
        {
          route: "IAM",
          icon: "settings.png",
        },
      ],
      bottomRouter: [
        {
          route: "Profile",
          icon: "settings.png",
        },
        {
          route: "Help",
          icon: "help_outline.png",
        },
      ],
    },
  ];

  return (
    <>
      <div className={`${sidebarClasses}`}>
        <div className="sidebar">
          <div className="sidebar-section">
            {sidebarRouter?.map((item, index) =>
              item?.topRouter?.map((subItem, subIndex) => (
                <NavLink
                  key={subIndex}
                  to={subItem.route === "Home" ? "/" : `/${subItem.route}`}
                  className={`sidebar-page ${
                    pathSegments.includes(subItem.route) ||
                    (pathSegments.length === 0 && subItem.route === "Home")
                      ? "active-link"
                      : ""
                  }`}
                  // style={{position:'relative'}}
                  onClick={() => setShow(false)}
                >
                  {subItem.route === "Home" ? (
                    <>
                      
                      <svg
                        style={{
                          width: "2.7rem",
                          height: "2.7rem",
                          flexShrink: "0",
                          marginLeft: "0.5rem",
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <path
                          d="M19 9.8V4.5H16V7.1L12 3.5L2 12.5H5V20.5H11V14.5H13V20.5H19V12.5H22L19 9.8ZM17 18.5H15V12.5H9V18.5H7V10.69L12 6.19L17 10.69V18.5Z"
                          fill={
                            (pathSegments.length === 0 ||
                              pathSegments[0] === "Home") &&
                            subItem.route === "Home"
                              ? "var(--Colours-Neutral-colours-White-10)"
                              : "var(--Colours-Typography-colours-Default---500)"
                          }
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      {subItem.route === "Dashboard" ? (
                        <svg
                          style={{
                            width: "2rem",
                            height: "2rem",
                            flexShrink: "0",
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M25.3333 6.66667V9.33333H20V6.66667H25.3333ZM12 6.66667V14.6667H6.66667V6.66667H12ZM25.3333 17.3333V25.3333H20V17.3333H25.3333ZM12 22.6667V25.3333H6.66667V22.6667H12ZM28 4H17.3333V12H28V4ZM14.6667 4H4V17.3333H14.6667V4ZM28 14.6667H17.3333V28H28V14.6667ZM14.6667 20H4V28H14.6667V20Z"
                            fill={
                              pathSegments.includes(subItem.route) &&
                              subItem.route === "Dashboard"
                                ? "var(--Colours-Neutral-colours-White-10)"
                                : "var(--Colours-Typography-colours-Default---500)"
                            }
                          />
                        </svg>
                      ) : (
                        <>
                          {subItem.route === "Versions" ? (
                            <svg
                              style={{
                                width: "2rem",
                                height: "2rem",
                                flexShrink: "0",
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                            >
                              <path
                                d="M26.6666 2.66666H5.33329C3.99996 2.66666 2.66663 3.86666 2.66663 5.33332V9.34666C2.66663 10.3067 3.23996 11.1333 3.99996 11.6V26.6667C3.99996 28.1333 5.46663 29.3333 6.66663 29.3333H25.3333C26.5333 29.3333 28 28.1333 28 26.6667V11.6C28.76 11.1333 29.3333 10.3067 29.3333 9.34666V5.33332C29.3333 3.86666 28 2.66666 26.6666 2.66666ZM25.3333 26.6667H6.66663V12H25.3333V26.6667ZM26.6666 9.33332H5.33329V5.33332H26.6666V9.33332Z"
                                fill={
                                  pathSegments.includes(subItem.route) &&
                                  subItem.route === "Versions"
                                    ? "var(--Colours-Neutral-colours-White-10)"
                                    : "var(--Colours-Typography-colours-Default---500)"
                                }
                              />
                              <path d="M20 16H12V18.6667H20V16Z" fill="white" />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </>
                  )}

                  <p>{subItem.route}</p>
                </NavLink>
              ))
            )}
          </div>
          <>
            {role_id === 4 ? (
              <></>
            ) : (
              <>
                {sidebarRouter?.map((item, index) =>
                  item?.roleWiseRouter?.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={`/${subItem.route}`}
                      className={`sidebar-page ${
                        pathSegments.includes(subItem.route)
                          ? "active-link"
                          : ""
                      }`}
                      onClick={() => setShow(false)}
                    >
                      <>
                        {subItem.route === "IAM" ? (
                          <svg
                            style={{
                              width: "2rem",
                              height: "2rem",
                              flexShrink: "0",
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                          >
                            <path
                              d="M25.9096 17.3067C25.963 16.88 26.003 16.4534 26.003 16C26.003 15.5467 25.963 15.12 25.9096 14.6934L28.723 12.4934C28.9763 12.2934 29.043 11.9334 28.883 11.64L26.2163 7.02669C26.0963 6.81335 25.8696 6.69335 25.6296 6.69335C25.5496 6.69335 25.4696 6.70669 25.403 6.73335L22.083 8.06669C21.3896 7.53335 20.643 7.09335 19.8296 6.76002L19.323 3.22669C19.283 2.90669 19.003 2.66669 18.6696 2.66669H13.3363C13.003 2.66669 12.723 2.90669 12.683 3.22669L12.1763 6.76002C11.363 7.09335 10.6163 7.54669 9.92296 8.06669L6.60296 6.73335C6.52296 6.70669 6.44296 6.69335 6.36296 6.69335C6.13629 6.69335 5.90963 6.81335 5.78963 7.02669L3.12296 11.64C2.94963 11.9334 3.02963 12.2934 3.28296 12.4934L6.09629 14.6934C6.04296 15.12 6.00296 15.56 6.00296 16C6.00296 16.44 6.04296 16.88 6.09629 17.3067L3.28296 19.5067C3.02963 19.7067 2.96296 20.0667 3.12296 20.36L5.78963 24.9734C5.90963 25.1867 6.13629 25.3067 6.37629 25.3067C6.45629 25.3067 6.53629 25.2934 6.60296 25.2667L9.92296 23.9334C10.6163 24.4667 11.363 24.9067 12.1763 25.24L12.683 28.7734C12.723 29.0934 13.003 29.3334 13.3363 29.3334H18.6696C19.003 29.3334 19.283 29.0934 19.323 28.7734L19.8296 25.24C20.643 24.9067 21.3896 24.4534 22.083 23.9334L25.403 25.2667C25.483 25.2934 25.563 25.3067 25.643 25.3067C25.8696 25.3067 26.0963 25.1867 26.2163 24.9734L28.883 20.36C29.043 20.0667 28.9763 19.7067 28.723 19.5067L25.9096 17.3067ZM23.2696 15.0267C23.323 15.44 23.3363 15.72 23.3363 16C23.3363 16.28 23.3096 16.5734 23.2696 16.9734L23.083 18.48L24.2696 19.4134L25.7096 20.5334L24.7763 22.1467L23.083 21.4667L21.6963 20.9067L20.4963 21.8134C19.923 22.24 19.3763 22.56 18.8296 22.7867L17.4163 23.36L17.203 24.8667L16.9363 26.6667H15.0696L14.603 23.36L13.1896 22.7867C12.6163 22.5467 12.083 22.24 11.5496 21.84L10.3363 20.9067L8.92296 21.48L7.22963 22.16L6.29629 20.5467L7.73629 19.4267L8.92296 18.4934L8.73629 16.9867C8.69629 16.5734 8.66963 16.2667 8.66963 16C8.66963 15.7334 8.69629 15.4267 8.73629 15.0267L8.92296 13.52L7.73629 12.5867L6.29629 11.4667L7.22963 9.85335L8.92296 10.5334L10.3096 11.0934L11.5096 10.1867C12.083 9.76002 12.6296 9.44002 13.1763 9.21335L14.5896 8.64002L14.803 7.13335L15.0696 5.33335H16.923L17.3896 8.64002L18.803 9.21335C19.3763 9.45335 19.9096 9.76002 20.443 10.16L21.6563 11.0934L23.0696 10.52L24.763 9.84002L25.6963 11.4534L24.2696 12.5867L23.083 13.52L23.2696 15.0267ZM16.003 10.6667C13.0563 10.6667 10.6696 13.0534 10.6696 16C10.6696 18.9467 13.0563 21.3334 16.003 21.3334C18.9496 21.3334 21.3363 18.9467 21.3363 16C21.3363 13.0534 18.9496 10.6667 16.003 10.6667ZM16.003 18.6667C14.5363 18.6667 13.3363 17.4667 13.3363 16C13.3363 14.5334 14.5363 13.3334 16.003 13.3334C17.4696 13.3334 18.6696 14.5334 18.6696 16C18.6696 17.4667 17.4696 18.6667 16.003 18.6667Z"
                              fill={
                                pathSegments.includes(subItem.route) &&
                                subItem.route === "IAM"
                                  ? "var(--Colours-Neutral-colours-White-10)"
                                  : "var(--Colours-Typography-colours-Default---500)"
                              }
                            />
                          </svg>
                        ) : (
                          <></>
                        )}
                      </>
                      <p>{subItem.route}</p>
                    </NavLink>
                  ))
                )}
              </>
            )}
          </>
          {sidebarRouter?.map((item, index) =>
            item?.bottomRouter?.map((subItem, subIndex) => (
              <NavLink
                key={subIndex}
                to={`/${subItem.route}`}
                className={`sidebar-page ${
                  pathSegments.includes(subItem.route) ? "active-link" : ""
                }`}
                onClick={() => setShow(false)}
              >
                <>
                  {subItem?.route === "Profile" ? (
                    <svg
                      style={{ width: "2rem", height: "2rem", flexShrink: "0" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                    >
                      <path
                        d="M18 8.85C19.74 8.85 21.15 10.26 21.15 12C21.15 13.74 19.74 15.15 18 15.15C16.26 15.15 14.85 13.74 14.85 12C14.85 10.26 16.26 8.85 18 8.85ZM18 22.35C22.455 22.35 27.15 24.54 27.15 25.5V27.15H8.85V25.5C8.85 24.54 13.545 22.35 18 22.35ZM18 6C14.685 6 12 8.685 12 12C12 15.315 14.685 18 18 18C21.315 18 24 15.315 24 12C24 8.685 21.315 6 18 6ZM18 19.5C13.995 19.5 6 21.51 6 25.5V30H30V25.5C30 21.51 22.005 19.5 18 19.5Z"
                        fill={
                          pathSegments.includes(subItem.route) &&
                          subItem.route === "Profile"
                            ? "var(--Colours-Neutral-colours-White-10)"
                            : "var(--Colours-Typography-colours-Default---500)"
                        }
                      />
                    </svg>
                  ) : (
                    <>
                      {subItem?.route === "Help" ? (
                        <svg
                          style={{
                            width: "2rem",
                            height: "2rem",
                            flexShrink: "0",
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M14.6666 24H17.3333V21.3334H14.6666V24ZM16 2.66669C8.63996 2.66669 2.66663 8.64002 2.66663 16C2.66663 23.36 8.63996 29.3334 16 29.3334C23.36 29.3334 29.3333 23.36 29.3333 16C29.3333 8.64002 23.36 2.66669 16 2.66669ZM16 26.6667C10.12 26.6667 5.33329 21.88 5.33329 16C5.33329 10.12 10.12 5.33335 16 5.33335C21.88 5.33335 26.6666 10.12 26.6666 16C26.6666 21.88 21.88 26.6667 16 26.6667ZM16 8.00002C13.0533 8.00002 10.6666 10.3867 10.6666 13.3334H13.3333C13.3333 11.8667 14.5333 10.6667 16 10.6667C17.4666 10.6667 18.6666 11.8667 18.6666 13.3334C18.6666 16 14.6666 15.6667 14.6666 20H17.3333C17.3333 17 21.3333 16.6667 21.3333 13.3334C21.3333 10.3867 18.9466 8.00002 16 8.00002Z"
                            fill={
                              pathSegments.includes(subItem.route) &&
                              subItem.route === "Help"
                                ? "var(--Colours-Neutral-colours-White-10)"
                                : "var(--Colours-Typography-colours-Default---500)"
                            }
                          />
                        </svg>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
                <p>{subItem.route}</p>
              </NavLink>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;
