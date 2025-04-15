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
      <span class='bg-amber-500'>ff</span>
      <button class='text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700'>bb</button>
      <br />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App