import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const userDataContext = createContext()
import io from 'socket.io-client'


export let socket = io("http://localhost:8000")

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const [getPostData, setPostData] = useState([]);
  const { serverUrl } = useContext(authDataContext);
  const [profileData, setProfileData] = useState([]);
  const navigate = useNavigate();



  const getCurrentUser = async () => {
    try {
      const res = await axios.get(serverUrl + "/api/user/currentUser", {
        withCredentials: true,
      });
      setUserData(res.data);
      // localStorage.setItem("userData", JSON.stringify(res.data));
    } catch (error) {
      console.log("Error fetching user:", error);
      setUserData(null);
      // localStorage.removeItem("userData");
    } finally {
      setLoading(false); // ✅ Mark loading as done
    }
  };

  const getPost = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/post/getPost", {
        withCredentials: true,
      });
      setPostData(result.data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleGetProfile = async (userName) => {

    try {
      const result = await axios.get(serverUrl + `/api/user/profile/${userName}`, {
        withCredentials: true,
      });
      setProfileData(result.data);
      navigate("/profile")
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    // const saved = localStorage.getItem("userData");
    // if (saved) {
    //   setUserData(JSON.parse(saved));
    // }
    getCurrentUser();
    getPost();
  }, []);


  return (
    <userDataContext.Provider
      value={{
        userData,
        setUserData,
        edit,
        setEdit,
        getPostData,
        setPostData,
        getPost,
        loading,
        handleGetProfile,
        profileData,
        setProfileData
      }}
    >
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext