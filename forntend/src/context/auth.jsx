import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const api = "http://localhost:5000/api/auth/";


export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const baseApi = axios.create({
        baseURL: 'http://localhost:5000/api/', // Replace with your API's base URL
        timeout: 5000, // Optional: sets a request timeout
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token") ? true : false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    let redirect;
    const login = async (email, password) => {
        try {
            let res = await baseApi.post("/user/login", { email, password });

            if (res.status != 200 && !res.data["token"]) {

                throw new Error(res.data.message);
            }
            localStorage.setItem("token", res.data.token);
            alert("login successfully");
            if (redirect) {
                setIsAuthenticated(true);
                navigate(redirect);
            } else {
                setIsAuthenticated(true);
                navigate("/");
            }


        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const signup = async (name, email, password, cPassword) => {
        try {

            let res = await baseApi.post("/user/register", { name, email, password, cPassword });
            if (res.status != 200) {

                throw new Error(res.data.message)
            }

            alert("successfully sigup");


            return;

        } catch (error) {

            return error.message;
        }
    }

    const logout = () => {
        try {

            let isLogout = confirm("are you sure logout?");
            if (isLogout) {
                localStorage.removeItem("token");
                setIsAuthenticated(false);

            }
            navigate("/auth");
        } catch (error) {
            console.log(error);
            alert("something went wrong");
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, signup, logout,baseApi }}>
            {children}
        </AuthContext.Provider>
    )

}



