import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar";
import { cleanSessions, endSession } from "../utils/session";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/Sessions";
import { queryGamebySessionId } from "../utils/query";

export default function Session() {
  const {activeSessions, setActiveSessions} = useContext(SessionContext);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState({});
  

  useEffect(() => {
    // get game of this session
    const init = async () => {
      const game = await queryGamebySessionId(sessionId);
      // if session not exist in localStorage, go back
      if (game === undefined){
        cleanSessions(activeSessions, setActiveSessions);
        alert('Session not exist.')
        navigate(-1);
      }
      setGame(game);
    } 
    init();
  }, [])
  
  const handleEndSession = () => {
    endSession(undefined, sessionId, activeSessions, setActiveSessions);
    navigate(-1);
  }
  return (
    <>
      <Navbar />
      <p>Session of {game.name}: {sessionId}</p>
      <button className="border">Advance Question</button>
      <button onClick={handleEndSession} className="border">End Session</button>
      <div className="border">
        Display results.
      </div>
    </>
    
  )
}