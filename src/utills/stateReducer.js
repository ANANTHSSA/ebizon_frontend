const userDataFromSession = JSON.parse(sessionStorage.getItem("userDetails"));
const popupData = JSON.parse(sessionStorage.getItem("Popup"));
const mandatory = JSON.parse(sessionStorage.getItem("mandatory"));
export const initialState = {
  isLogin: userDataFromSession?.isLoggedIn || false,
  token: userDataFromSession && userDataFromSession?.token,
  networkError: false,
  user_Data: userDataFromSession && userDataFromSession,
  popupData: popupData && popupData,
  mandatory:mandatory && mandatory,
};
export const stateReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLogin: action.payload,
      };
    case "NETWORK_ERROR":
      return {
        ...state,
        networkError: action.payload,
      };
    case "TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isLogin: false,
      };

    case "USER_DATA":
      return {
        ...state,
        user_Data: action.payload,
      };
    case "POPUP":
      return {
        ...state,
        popupData: action.payload,
      };
      case "MANDATORY":
        return {
          ...state,
          mandatory: action.payload,
        }

    default:
      return state;
  }
};
