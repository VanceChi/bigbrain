import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import Navbar from './components/Navbar'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// const data = await loginUser("hayden@unsw.edu.au", "adummypassword");
// console.log('-------data:', data)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App