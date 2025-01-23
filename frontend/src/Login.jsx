import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Basic login validation (can be replaced with actual logic)
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    alert("Logged in successfully!");
    navigate("/"); // Redirect to the homepage
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
