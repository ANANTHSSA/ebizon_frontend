import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "../../utills/statecontact";
import { UseFetch } from "../../utills/UseFetch";
import "../../styles/Settings.scss";
import UserTable from "./UserTable";
import PrimaryBtn from "../../common/PrimaryBtn";
import AccessTable from "./AccessTable";
import Loading from "../../common/Loading";
import User_Profile from "./User_Profile";

interface CategoryData {
  role_id: number;
}

const Setting= () => {
  const {
    state: {
      user_Data: { user_id },
      popupData,
    },
    dispatch,
  } = useContext(stateContext);

  const { data: userRole,setRefetch:userRoleRefetch } = UseFetch(
    `/users?user_id=${user_id}`,
    "GET",
    dispatch
  );
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    setCategories(userRole);
    if(userRole){
      if(categories[0]?.role_id === 4){
        setActiveLink("Profile");
      }
      else{
        setActiveLink("Users");
      }
    }
  }, [userRole,categories]);

  const role_id = categories[0]?.role_id;



  const [activeLink, setActiveLink] = useState("Users");

    const { data, setRefetch: setRefetchUser,error } = UseFetch(
      "/users",
      "GET",
      dispatch
    );
  const filteredUsers = data?.filter((user: any) => user.role_id !== 1);


console.log(filteredUsers);


  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(filteredUsers);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    const filteredResult = data?.filter(
      (item: any) =>
        item?.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.email_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResult);
  }, [data, searchTerm]);

  const handleLinkClick = (link: string, e: any) => {
    e.preventDefault();
    setActiveLink(link);
    
   
  };
  const createUserFunction = () => {
    const popupData = {
      showPopup: true,
      type: "Create User",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };
  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }
  return (
    <section id="settings">
      {categories?.length > 0 ? (<>
        <nav
        className="navbar navbar-expand-sm filter pb-1"
        style={{
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <div className="container-fluid p-0">
          {/* <a className="navbar-brand" href="#">Navbar</a> */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {role_id === 4 ? (
                <>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeLink === "Profile" ? "active" : ""
                      }`}
                      href="#"
                      onClick={(e) => handleLinkClick("Profile", e)}
                    >
                      Profile
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeLink === "Users" ? "active" : ""
                      }`}
                      href="#"
                      onClick={(e) => handleLinkClick("Users", e)}
                    >
                      Users
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeLink === "Access" ? "active" : ""
                      }`}
                      href="#"
                      onClick={(e) => handleLinkClick("Access", e)}
                    >
                      Access
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeLink === "Profile" ? "active" : ""
                      }`}
                      href="#"
                      onClick={(e) => handleLinkClick("Profile", e)}
                    >
                      Profile
                    </a>
                  </li> */}
                </>
              )}
            </ul>
           
            {activeLink === "Users" && (
              <div className="d-flex">
                <input
                  className="inputsearch me-3"
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search"
                />
                <PrimaryBtn onClick={() => createUserFunction()} title=''>
                  Create User
                </PrimaryBtn>
              </div>
            )}
              {activeLink === "Access" && (
              <div className="d-flex">
                <input
                  className="inputsearch py-2 me-3"
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search"
                />
                {/* <PrimaryBtn onClick={() => createUserFunction()} title=''>
                  Create User
                </PrimaryBtn> */}
              </div>
            )}
          </div>
        </div>
      </nav>

      {activeLink === "Users" && (
        <>
          {data?.length > 0 ? (
            <UserTable
              data={filteredUsers}
              filteredData={filteredData}
              searchTerm={searchTerm}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              setRefetchUser={setRefetchUser}
              dispatch={dispatch}
              isPopupOpen={isPopupOpen}
              setIsPopupOpen={setIsPopupOpen}
              user_id={user_id}
              showToast={showToast}
              setShowToast={setShowToast}
              role_id={role_id}
            />
          ) : (
            <Loading />
          )}
        </>
      )}
      {activeLink === "Access" && (
        <>
          {data?.length > 0 ? (
            <AccessTable
              data={filteredUsers}
              filteredData={filteredData}
              searchTerm={searchTerm}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              setRefetchUser={setRefetchUser}
              dispatch={dispatch}
              isPopupOpen={isPopupOpen}
              setIsPopupOpen={setIsPopupOpen}
              user_id={user_id}
              showToast={showToast}
              setShowToast={setShowToast}
              role_id={role_id}
            />
          ) : (
            <Loading />
          )}
        </>
      )}
      {/* <>
      {activeLink === "Profile" && (
        <>
          {data?.length > 0 ? (
            <User_Profile
              data={data}
              user_id={user_id}
              dispatch={dispatch}
              setRefetchUser={setRefetchUser}
              showToast={showToast}
              setShowToast={setShowToast}
            />
          ) : (
            <Loading />
          )}
        </>
      )}
      </> */}
     
      </>):(<Loading/>)}
     
    </section>
  );
};

export default Setting;
