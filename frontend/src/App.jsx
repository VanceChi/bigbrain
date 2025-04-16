import './App.css'
import Page from './pages/Page'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


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