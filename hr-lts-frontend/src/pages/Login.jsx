import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        // Handle login logic here
        try{
            const response = await axios.post("http://localhost:5000/api/auth/login",{
                email,
                password
            })
            console.log(response.data)
            if(response.data.success){
                login(response.data.user);
                localStorage.setItem("token", response.data.token);
                if(response.data.user.role === "admin"){
                    navigate("/admin-dashboard");
                }
                else{
                    navigate("/employee-dashboard")
                }
            }
        }
        catch(error){
            if(error.response && !error.response.data.success){
                setError(error.response.data.error)
            }
            else{
                setError("Server error. Please try again later.")
            }
        }
    }
  return (
    <div>
    <h2>Employee Leave Tracking System</h2>
    <form>
        <h2>Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type="submit" onClick={handleSubmit}>Login</button>
    </form>
    </div>
  );
};

export default Login;