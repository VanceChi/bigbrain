import Register from "./Register"
import Login from "./Login"
import Dashboard from "./Dashboard"
import EditGame from "./EditGame";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from "react";

export default function Page({pageName}) {
  // const pages = {
  //   'Register': <Register />,
  //   'Login': <Login />,
  //   'Dashboard': <Dashboard />
  // }
  const [token, setToken] = useState(null);
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if(authData)
      setToken(authData.token)
  }, []);
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:gameId" element={<EditGame />} />
        </Routes>
      </Router>
      {/* {pages[pageName] || <div>Page not found</div>} */}
    </>
  )
}