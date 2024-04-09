import React from "react";

import { access, getRoleName } from "../../utills/CountFunc";

const AccessTable = ({
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
  role_id
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
  role_id:any;
}) => {
  const handleEditButtonClick = (user: any) => {
    setSelectedUser(user);
    if (user?.role_id === 2 || user_id === user?.user_id || role_id === 4) {
      setIsPopupOpen(false);
    } else {
      setIsPopupOpen(!isPopupOpen);
    }
  };

  const roleSolutionFunc = (userId: any) => {
    const popupData = {
      showPopup: true,
      user: userId,
      type: "User Roles & Solutions",
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
      <div>
        <p className="mb-0 setting-heading">Access Roles available</p>
        <p className="text-secondary w-75">
          A role provides access to predefined menus and features so that
          depending on the assigned role (Super Admin, Architect, Engineer) an
          administrator can have access to what is needed.
        </p>
      </div>
      <div className="row ">
        {access?.map((item: any, index: number) => (
          <div className="col-4" key={index}>
            <div className="border h-100 p-3">
              <h5>{item.rolename}</h5>
              {item.rights?.map((right: any, index: number) => (
                <li key={index}>{right.list}</li>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mb-0 setting-heading">Accounts</p>

      <table
        className="table"
        style={{
          borderTop: "1px solid #dee2e6",
          boxShadow: "var(--box-shadow-color)",
        }}
      >
        <thead className="table-heading">
          <tr className="align-middle">
            <th scope="col" style={{ paddingLeft: "0.5rem" }}>
              Name
            </th>
            <th className="col">Email</th>
            <th className="col">Role</th>
            <th className="col">Access</th>
            <th scope="col" className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        {filteredData?.length === 0 ? (
         <tbody className="text-center">
         <tr>
           <td colSpan={4}>
             <p className="text-center">No data found</p>
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
                <tbody key={index}>
                  <tr className="align-middle">
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`} style={{ paddingLeft: "0.5rem" ,wordWrap: 'break-word', maxWidth: '100px'}}>{item?.user_name}</td>
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`} style={{ wordWrap: 'break-word', maxWidth: '100px' }}>{item?.email_id}</td>
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`} style={{ wordWrap: 'break-word', maxWidth: '100px' }}>{getRoleName(item?.role_id)}</td>
                    <td className={`${item?.role_id === 2 ? "table-background" : " "}`} style={{ wordWrap: 'break-word', maxWidth: '100px' }}>
                      {item.solutions?.map(
                        (solution: any, solIndex: number) => (
                          <span key={solIndex} className="access-item">
                            {solution.solution_name ?? "No Solution Name"}
                          </span>
                        )
                      )}
                    </td>
                    <td className={`text-center popover1 ${item?.role_id === 2 ? "table-background" : " "}`}  style={{ wordWrap: 'break-word', maxWidth: '100px' }}>
                      {item?.user_id === selectedUser?.user_id &&
                        isPopupOpen &&
                        selectedUser && (
                          <div className="popover-content">
                            <div
                              className="popover-cont"
                              style={{ cursor: "pointer" }}
                              onClick={() => roleSolutionFunc(item?.user_id)}
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
                                  <span>User & Solutions</span>
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
    </>
  );
};

export default AccessTable;
