import React from "react";
import ToggleBtn from "../../common/ToggleBtn";
import { UseFetch } from "../../utills/UseFetch";
import Toast from "../../common/Toast";
import { getRoleName } from "../../utills/CountFunc";

const UserTable = ({
  data,
  filteredData,
  searchTerm,
  selectedUser,
  setSelectedUser,
  setRefetchUser,
  dispatch,
  isPopupOpen,
  setIsPopupOpen,
  user_id,
  showToast,
  setShowToast,
  role_id,
}: {
  data: any;
  filteredData: any;
  searchTerm: any;
  selectedUser: any;
  setSelectedUser: any;
  setRefetchUser: any;
  dispatch: any;
  isPopupOpen: any;
  setIsPopupOpen: any;
  user_id: any;
  showToast: any;
  setShowToast: any;
  role_id: any;
}) => {
  const { apiCall: updateUser, message: updateMessage } = UseFetch(
    "/users",
    "PUT",
    dispatch
  );

  const handleToggleClick = async (currentActiveState: any, userId: any) => {
    try {
      const putPayload = {
        is_active: currentActiveState ? true : false,
      };

      await updateUser(putPayload, userId);
      setShowToast(true);
      setSelectedUser((prevUser: any) => ({
        ...prevUser,
        is_active: currentActiveState ? true : false,
      }));
      setRefetchUser(true);
    } catch (error) {
      console.error("Error toggling user:", error);
    }
  };
  const handleEditButtonClick = (user: any) => {
    setSelectedUser(user);
    if (user?.role_id === 2 || user_id === user?.user_id || role_id === 4) {
      setIsPopupOpen(false);
    } else {
      setIsPopupOpen(!isPopupOpen);
    }
  };
  const editUserFunc = (userId: any) => {
    const popupData = {
      showPopup: true,
      user: userId,
      type: "Edit",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };
  const deleteUserFunc = (userId: any) => {
    const popupData = {
      showPopup: true,
      user: userId,
      type: "Delete",
    };
    const popupDataString = JSON.stringify(popupData);
    sessionStorage.setItem("Popup", popupDataString);
    dispatch({
      type: "POPUP",
      payload: popupData,
    });
  };
const passwordChangeFunc = (userId: any) => {
  const popupData = {
    showPopup: true,
    user: userId,
    type:"ChangePassword",
  };
  const popupDataString = JSON.stringify(popupData);
  sessionStorage.setItem("Popup", popupDataString);
  dispatch({
    type: "POPUP",
    payload: popupData,
  })
}
  return (
    <>
      <p className="mb-0 setting-heading">Users Management</p>

      <table 
        className="table"
        style={{
          borderTop: "1px solid #dee2e6",
          boxShadow: "var(--box-shadow-color)",
        }}
      >
        <thead className="table-heading">
          <tr className="align-middle">
            <th
              scope="col"
              style={{
                paddingLeft: "0.5rem",
                wordWrap: "break-word",
                maxWidth: "100px",
              }}
            >
              Name
            </th>
            <th style={{ wordWrap: "break-word", maxWidth: "100px" }}>Email</th>
            <th style={{ wordWrap: "break-word", maxWidth: "100px" }}>Role</th>
            <th
              style={{ wordWrap: "break-word", maxWidth: "100px" }}
              scope="col"
            >
              Status
            </th>
            <th
              style={{ wordWrap: "break-word", maxWidth: "100px" }}
              scope="col"
              className="text-center"
            >
              Actions
            </th>
          </tr>
        </thead>
        {filteredData?.length === 0 ? (
          <tbody className="text-center">
            <tr>
              <td colSpan={4}>
                <p>No data found</p>
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            {data
              ?.filter(
                (item: any) =>
                  item.user_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  item.email_id.toLowerCase().includes(searchTerm.toLowerCase())
              )
              ?.map((item: any, index: number) => (
                console.log("item", item),
                
                <tbody key={index}>
                  <tr className="align-middle">
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`}
                      style={{
                        paddingLeft: "0.5rem",
                        wordWrap: "break-word",
                        maxWidth: "100px",
                        paddingRight: "4rem",
                      }}
                    >
                      
                      {item?.user_name}
                    </td>
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`}
                      style={{
                        wordWrap: "break-word",
                        maxWidth: "100px",
                        paddingRight: "4rem",
                      }}
                    >
                      {item?.email_id}
                    </td>
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`}
                      style={{
                        wordWrap: "break-word",
                        maxWidth: "100px",
                        paddingRight: "4rem",
                      }}
                    >
                      {getRoleName(item?.role_id)}
                    </td>
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`} style={{ wordWrap: "break-word", maxWidth: "100px" }}>
                      {item?.role_id === 2 || user_id === item?.user_id ? (
                        <img
                          src={require("../../assets/Icons/check_circle (1).png")}
                          alt="success"
                        />
                      ) : (
                        <ToggleBtn
                          initialActive={
                            selectedUser?.user_id === item.user_id
                              ? selectedUser?.is_active
                              : item.is_active
                          }
                          onClick={(isActive) =>
                            handleToggleClick(isActive, item.user_id)
                          }
                        />
                      )}
                    </td>

                    <td 
                      className={`text-center popover1 ${item?.role_id === 2 ? "table-background" : " "}`}
                      style={{ wordWrap: "break-word", maxWidth: "100px" }}
                    >
                      {item?.user_id === selectedUser?.user_id &&
                        isPopupOpen &&
                        selectedUser && (
                          <div className="popover-content">
                            <div
                              className="popover-cont"
                              style={{ cursor: "pointer" }}
                              onClick={() => editUserFunc(item?.user_id)}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="col-3">
                                  <img
                                    className="text-start"
                                    src={require("../../assets/Icons/Style=Outlined.png")}
                                    alt="edit"
                                  />
                                </div>
                                <div className="col-9">
                                  <span>Edit</span>
                                </div>
                              </div>
                            </div>
                            <div
                              className="popover-cont"
                              style={{ cursor: "pointer" }}
                              onClick={() => passwordChangeFunc(item?.user_id)}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="col-3">
                                  <img
                                    className="text-start"
                                    src={require("../../assets/Icons/Style=Outlined.png")}
                                    alt="edit"
                                  />
                                </div>
                                <div className="col-9">
                                  <span>Change Password</span>
                                </div>
                              </div>
                            </div>
                            <div
                              className="popover-cont"
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteUserFunc(item?.user_id)}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="col-3">
                                  <svg
                                    className="text-start "
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
                                      fill="#171717"
                                    />
                                  </svg>
                                
                                </div>
                                <div className="col-9">
                                  <span className="ms-3">Delete</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      {item?.role_id === 2 || user_id === item?.user_id ? (
                        <img
                          src={require("../../assets/Icons/check_circle (1).png")}
                          alt="success"
                        />
                      ) : (
                        <img
                          style={{ cursor: "pointer" }}
                          src={require("../../assets/Icons/Style=Two Tone (2).png")}
                          alt="action"
                          onClick={() => handleEditButtonClick(item)}
                        />
                      )}
                    </td>
                  </tr>
                </tbody>
              ))}
          </>
        )}
      </table>
      {showToast && (
        <Toast messages={updateMessage} onClose={() => setShowToast(false)} />
      )}
    </>
  );
};
export default UserTable;
