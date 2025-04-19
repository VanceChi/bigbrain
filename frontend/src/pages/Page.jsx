import Register from "./Register"
import Login from "./Login"
import Dashboard from "./Dashboard"
import EditGame from "./EditGame";
import EditQuestion from "./EditQuestion";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) localStorage.clear();
  return token? children : <Navigate to="/login" replace />;
}

export default function Page({}) {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
            } />
          <Route path="/game/:gameId" element={
            <ProtectedRoute>
              <EditGame />
            </ProtectedRoute>
            } />
            <Route path="/game/:gameId/question/:questionId" element={
              <ProtectedRoute>
                <EditQuestion />
              </ProtectedRoute>
              } />
        </Routes>
      </Router>
    </>
  )
}