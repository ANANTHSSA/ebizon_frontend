import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const role = JSON.parse(sessionStorage.getItem("userDetails"))?.role_id;
const user_id = JSON.parse(sessionStorage.getItem("userDetails"))?.user_id;
export const UseFetch = (url, method = "GET", dispatch) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const apiCall = async (payload, questionid) => {
    setLoading(true);
    let response;
    try {
      const token = JSON.parse(sessionStorage.getItem("userDetails"))?.token;
      const config = {
        headers: { Authorization: `Bearer ${token}`, role_id: role },
      };
      if (method === "GET") {
        response = await axios.get(url, config);
      } else if (method === "POST" && payload) {
        response = await axios.post(url, payload, config);
      } else if (method === "PUT" && questionid) {
        const putUrl = `${url}/${questionid}`;
        response = await axios.put(putUrl, payload, config);
      } else if (method === "DELETE" && questionid) {
        const deleteUrl = `${url}/${questionid}`;
        response = await axios.delete(deleteUrl, config);
      } else if (method === "PATCH") {
        const patchUrl = `${url}`;
        response = await axios.patch(patchUrl, config);
      } else {
        console.log("Unsupported HTTP method:", method);
      }
      setMessage(response.data);
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newAccessToken = await refreshAccessToken();
          const newConfig = {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              role_id: role,
            },
          };
          if (method === "GET") {
            response = await axios.get(url, newConfig);
          } else if (method === "POST" && payload) {
            response = await axios.post(url, payload, newConfig);
          } else if (method === "PUT" && questionid) {
            const putUrl = `${url}/${questionid}`;
            response = await axios.put(putUrl, payload, newConfig);
          } else if (method === "DELETE" && questionid) {
            const deleteUrl = `${url}/${questionid}`;
            response = await axios.delete(deleteUrl, newConfig);
          } else if (method === "PATCH") {
            const patchUrl = `${url}`;
            response = await axios.patch(patchUrl, newConfig);
          }
          setMessage(response.data);
          setData(response.data);
        } catch (refreshError) {
          handleError(refreshError, user_id, dispatch);
        }
      } else {
        handleError(error, user_id, dispatch);
      }
    } finally {
      setLoading(false);
    }
  };
  const refreshAccessToken = async () => {
    try {
      const response = await axios.get("/refresh", {
        withCredentials: true,
      });
      if (
        response.headers["content-type"] &&
        !response.headers["content-type"].includes("application/json")
      ) {
        console.log("Non-JSON response:", response.data);
      }
      const newAccessToken = response.data.accessToken;
      dispatch({
        type: "TOKEN",
        payload: newAccessToken,
      });
      const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
      userDetails.token = newAccessToken;
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      setData([]);
      setRefetch(true);
      return newAccessToken;
    } catch (error) {
      throw error;
    }
  };
  const handleError = async (error, user_id, dispatch) => {
    if (error.response && error.response.status === 408) {
      try {
        const role = JSON.parse(sessionStorage.getItem("userDetails"))?.role_id;
        const user_id = JSON.parse(
          sessionStorage.getItem("userDetails")
        )?.user_id;
        const token = JSON.parse(
          sessionStorage.getItem("userDetails")
        )?.accessToken;
        const inputDateString = new Date().toISOString();
        const utcDate = inputDateString.slice(0, 19).replace("T", " ");
        const loginResponse = await axios.put(
          `/users/logout/${user_id}`,
          {
            logout_time: utcDate,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              role_id: role,
            },
            withCredentials: true,
          }
        );
        const removecookies = await axios.patch(`/logout`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            role_id: role,
          },
          withCredentials: true,
        });
        if (loginResponse.status === 200) {
          sessionStorage.clear();
          cookies.remove("jwt");
          dispatch({
            type: "LOGOUT",
          });
          navigate("/");
        }

        // sessionStorage.clear();
        // cookies.remove("jwt");
        // dispatch({
        //   type: "LOGOUT",
        // });
        // navigate("/");
      } catch (logoutError) {
        console.log("Error logging out:", logoutError);
      }
    } else if (error.response && error.response.status === 406) {
      console.log("rajesh");
      const role = JSON.parse(sessionStorage.getItem("userDetails"))?.role_id;
      const token = JSON.parse(
        sessionStorage.getItem("userDetails")
      )?.accessToken;
      const removecookies = await axios.patch(`/logout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          role_id: role,
        },
        withCredentials: true,
      });
      console.log("removecookies", removecookies);
      if (removecookies.status === 204) {
        sessionStorage.clear();
        cookies.remove("jwt");
        dispatch({
          type: "LOGOUT",
        });
        navigate("/");
      }
    } else {
      setError(error.message || "An error occurred");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await apiCall();
      } catch (error) {
        handleError(error, user_id);
      }
    };
    fetchData();
    if (refetch) {
      fetchData();
      setRefetch(false); // Reset refetch to false after making the call
    }
  }, [url, method, dispatch, refetch, user_id]);
  return {
    data,
    loading,
    error,
    setRefetch,
    refetch,
    apiCall,
    message,
  };
};
export default UseFetch;
