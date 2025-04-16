import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import Navbar from './components/Navbar'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page from './components/Page'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page pageName='Login' />} />
        <Route path="/login" element={<Page pageName='Login' />} />
        <Route path="/register" element={<Page pageName='Register' />} />
        <Route path="/dashboard" element={<Page pageName='Dashboard' />} />
        
      </Routes>
    </Router>
  );
}

export default App