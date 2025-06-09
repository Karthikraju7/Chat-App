import { createContext , useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast"
import {io} from "socket.io-client"

const backendUrl = process.env.REACT_APP_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
    console.log("Attaching token:", token); // ✅ Move console.log here
  }
  return config;    
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {                                                         
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const checkAuth = async () => {
    try {
        const { data } = await axios.get("/api/auth/check");
        console.log("checkAuth response:", data);

        if (data.success) {
            console.log("Setting authUser to:", data.user);
            setAuthUser(data.user);
            connectSocket(data.user);
        } else {
            console.log("Auth failed, clearing authUser");
            setAuthUser(null);
            setToken(null);
            localStorage.removeItem("token");
        }
    } catch (error) {
        console.error("checkAuth error:", error.message);
        setAuthUser(null);
        setToken(null);
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
    }
};


    const login = async (state,credentials) => {
        try {
            const {data} = await axios.post(`/api/auth/${state}`,credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logout Successful")
        socket.disconnect();
    }

    //  const updateProfile = async () => {
    //     will commit later
    // }

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket =  io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=> {
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth()
    },[token])
    
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}