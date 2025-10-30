// import React from 'react'
// import Navbar from './Components/Navbar/Navbar'
// import Admin from './Pages/Admin/Admin'
// const App = () => {
//   return (
//     <div>
//       <Navbar/>
//       <Admin/>
//     </div>
//   )
// }

// export default App
import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin/Admin";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin-auth");
    if (savedAuth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    //i can set any password here
    if (password === "Pr@soon123") {
      localStorage.setItem("admin-auth", "true");
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <Admin />
    </div>
  );
};

export default App;
