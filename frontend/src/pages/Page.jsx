import Register from "./Register"
import Login from "./Login"
import Dashboard from "./Dashboard"
import EditGame from "./EditGame";
import EditQuestion from "./EditQuestion";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SessionContext } from '../context/Sessions';
import { useState } from 'react';
import Session from "./Session";
import PlayJoin from "./PlayJoin";
import PlayGame from "./PlayGame";
import Navbar from "../components/Navbar";

function ProtectedRoute({ children }) {
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) localStorage.clear();
  return token ? children : <Navigate to="/login" replace />;
}

function SessionProvider({ children }) {
  /**
   * activeSessions: [ 
   *   {gameId: gameId, activeSessionId: sessionId},
   *   {...} 
   * ]
   */
  const [activeSessions, setActiveSessions] = useState(() => {
    const storedSessions = localStorage.getItem('activeSessions');
    try {
      return storedSessions ? JSON.parse(storedSessions) : [];
    } catch (error) {
      console.error('Failed to parse activeSessions: ', error);
      return [];
    }
  })

  return (
    <SessionContext.Provider value={{ activeSessions, setActiveSessions }}>
      {children}
    </SessionContext.Provider>
  )
}

export default function Page() {

  return (
    <>
      <SessionProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
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
            <Route path="/session/:sessionId" element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            } />
            <Route path="/play/join/" element={<PlayJoin />} />
            <Route path="/play/join/:sessionId" element={<PlayJoin />} />
            <Route path="/play/:playerId" element={<PlayGame />} />
          </Routes>
        </Router>
      </SessionProvider>
    </>
  )
}