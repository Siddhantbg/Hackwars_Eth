import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import "./App.css";
import { ToastContainer } from "react-toastify";

const API_KEY = "IRI57XAY533YXUSDTU9J9TU6ZY9B4IWSRS";

const App = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [tag, setTag] = useState("");
  const [taggedAddress, setTaggedAddress] = useState(null);

  useEffect(() => {
    if (address) fetchTag();
  }, [address]);

  const handleSearch = async () => {
    if (!address) {
      toast.error("Please enter a valid Ethereum address.");
      return;
    }

    setError("");
    await fetchAccountBalance();
    await fetchTransactions();
  };

  const fetchAccountBalance = async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`
      );

      if (response.data.status === "1" && response.data.result !== undefined) {
        const balanceInEther = (response.data.result / 1e18).toFixed(4); // Convert Wei to Ether

        if (balanceInEther === "0.0000") {
          setBalance(balanceInEther);
          toast.warn("Address is valid but has no balance.");
        } else {
          setBalance(balanceInEther);
          toast.success("Account balance fetched successfully!");
        }
      } else {
        setError("Invalid Ethereum address or unable to fetch details.");
        setBalance(null);
        toast.error("Invalid address or unable to fetch account balance.");
      }
    } catch (err) {
      setError("Failed to fetch account details.");
      toast.error("Failed to fetch account balance. Please check your network.");
      setBalance(null);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`
      );
      if (response.data.status === "1") {
        setTransactions(response.data.result.slice(0, 10)); // Show the latest 10 transactions
      } else {
        setTransactions([]);
        toast.error("Invalid address or no transactions found.");
      }
    } catch (err) {
      setTransactions([]);
      toast.error("Failed to fetch transactions. Please try again.");
    }
  };

  const fetchTag = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tag/${address}`);
      setTaggedAddress(response.data);
    } catch (err) {
      setError("Error fetching tag");
    }
  };

  const saveTag = async () => {
    if (tag) {
      try {
        const response = await axios.post("http://localhost:5000/api/tag", {
          address,
          tag,
        });
        setTaggedAddress(response.data);
        setTag("");
      } catch (err) {
        setError("Error saving tag");
      }
    } else {
      setError("Please select a tag.");
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>TrustMaker</h1>
        <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
      </header>
      
      <main>
        <section className="search">
          <input
            type="text"
            placeholder="Enter Ethereum Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </section>

        {error && <p className="error">{error}</p>}

        {balance !== null && (
          <section className="result">
            <h2>Account Balance</h2>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>

            {taggedAddress ? (
              <p className="tagged">
                <strong>Tag:</strong> {taggedAddress.tag}
              </p>
            ) : (
              <div className="tagging">
                <select value={tag} onChange={(e) => setTag(e.target.value)}>
                  <option value="">Select Tag</option>
                  <option value="Whitehat">Whitehat</option>
                  <option value="Hacker">Hacker</option>
                  <option value="Whale Trader">Whale Trader</option>
                  <option value="Airdrop Hunter">Airdrop Hunter</option>
                  <option value="Rookie">Rookie</option>
                  <option value="Liquidity Provider">Liquidity Provider</option>
                  <option value="Bot">Bot</option>
                </select>
                <button onClick={saveTag}>Save Tag</button>
              </div>
            )}
          </section>
        )}

        {transactions.length > 0 && (
          <section className="transactions">
            <h2>Recent Transactions</h2>
            {transactions.map((tx, index) => (
              <div key={index} className="transaction">
                <p><strong>Hash:</strong> {tx.hash}</p>
                <p><strong>From:</strong> {tx.from}</p>
                <p><strong>To:</strong> {tx.to}</p>
                <p><strong>Value:</strong> {(tx.value / 1e18).toFixed(4)} ETH</p>
                <p><strong>Block:</strong> {tx.blockNumber}</p>
                <hr />
              </div>
            ))}
          </section>
        )}
      </main>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
