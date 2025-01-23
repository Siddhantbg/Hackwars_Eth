import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { toast } from 'react-toastify'
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
})

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
}



  const handleLogin = async (e) => {
    // // Basic login validation (can be replaced with actual logic)
    // if (!email || !password) {
    //   alert("Please enter email and password.");
    //   return;
    // }
    // alert("Logged in successfully!");
    // navigate("/"); // Redirect to the homepage
    e.preventDefault()

        let new_url = `http://localhost:5000`;
        if (currState === "Login") {
            new_url += "/api/user/login";
        }
        // else {
        //     new_url += "/api/user/register"
        // }
        data.email = email;
        data.password = password;
        const response = await axios.post(new_url, data);
        if (response.data.success) {
            // setToken(response.data.token)
            localStorage.setItem("token", response.data.token);
            // loadCartData({token:response.data.token})
            // setShowLogin(false)
            navigate("/");
        }
        else {
            toast.error(response.data.message)
        }
  };

  const handleMetaMaskLogin = () => {
    alert("MetaMask login not implemented yet.");
    // MetaMask login logic can be added here
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleMetaMaskLogin} className="metamask-button">
        Login with MetaMask
      </button>
    </div>
  );
};

export default Login;
