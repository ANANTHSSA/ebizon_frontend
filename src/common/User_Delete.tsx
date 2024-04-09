import React from "react";
import PrimaryBtn from "./PrimaryBtn";
import { getRoleName } from "../utills/CountFunc";
import { UseFetch } from "../utills/UseFetch";
import Toast from "./Toast";


const User_Delete = ({
  close,
  userInfo,
  dispatch,
  showToast,
  setShowToast
}: {
  close: any;
  userInfo: any;
  dispatch: any;
  showToast:any;
  setShowToast:any;
}) => {
  const { apiCall: modelDeleteApiCall, message: deleteMessage } = UseFetch(
    "/users",
    "DELETE",
    dispatch
  );
 
  const deleteUser = async (user_id: any) => {
    const deleteUser = {
      is_delete: false,
    };
    if (userInfo.user_id) {
      await modelDeleteApiCall(deleteUser, user_id);
    }
    setShowToast(true);
  };
  return (
    <div>
      <h3 className="mb-4">Delete Account</h3>
      <div className="row align-items-center">
        <div className="col-6">
          <div>
            <img
              src={require("../assets/Icons/Type=Icon, Gender=Man (1).png")}
              alt="profile"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="popup-delete">
            <p>
              Are you sure went do delete the account{" "}
              <i>{userInfo?.email_id}</i> ?
            </p>
            <table className="table">
              <tbody>
                <tr className="align-middle">
                  <th>Name</th>
                  <td>{userInfo?.user_name}</td>
                </tr>
                <tr className="align-middle">
                  <th>Company Name</th>
                  <td>{userInfo?.company_name}</td>
                </tr>
                <tr className="align-middle">
                  <th>Role</th>
                  <td>{getRoleName(userInfo?.role_id)}</td>
                </tr>
              </tbody>
              </table>
          </div>
        </div>
        <div className="text-end mt-5">
          <PrimaryBtn
            onClick={() => close()}
            style={{
              background: "none",
              color: "var(--Colours-Primary-colour-Blue-500)",
              border: "1px solid var(--Colours-Primary-colour-Blue-500)",
            }}
            title=''
          >
            Cancel
          </PrimaryBtn>
          <PrimaryBtn
            style={{ marginLeft: "1rem" }}
            onClick={() => deleteUser(userInfo?.user_id)}
            title=''
          >
            Delete
          </PrimaryBtn>
        </div>
      </div>
      {showToast  && (
         <Toast messages={deleteMessage} onClose={() => close()}/>
      )}
    </div>
  );
};

export default User_Delete;
