import { useLocation, useParams } from "react-router-dom"
import Navbar from "../components/Navbar";
import { checkSessionState, endSession } from "../utils/session";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/Sessions";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";

export default function Session() {
  const {activeSessions, setActiveSessions} = useContext(SessionContext);
  const { sessionId } = useParams();
  const [active, setActive] = useState(false);
  const {state} = useLocation();  // keys: title
  const [results, setResults] = useState([]);

  useEffect(() => {
    // get game of this session
    const init = async () => {
      const isActive = await checkSessionState(sessionId);
      setActive(isActive);
    } 
    init();
  }, [])

  // Since cant restart session. The effect here means active -> unactive
  // Shows result.
  useEffect(() => {
    const loadResult = async () => {
      const res = await apiCall(`/admin/session/${sessionId}/results`, 'GET'); //{results: Array(0)}
      setResults(res.results);
    }
    
    loadResult();
    
  }, [active])
  
  const handleEndSession = () => {
    endSession(undefined, sessionId, activeSessions, setActiveSessions);
  }
  return (
    <>
      <Navbar />
      <BackButton />
      {active? (
        <p>Session active</p>
      ) : (
        <p>Session unactive</p>
      )}
      <p>Session of {state.title}: {sessionId}</p>
      <button className="border">Advance Question</button>
      <button onClick={handleEndSession} className="border">End Session</button>
      <div className="border">
        {(results.length === 0) ? (
          <p>No results.</p>
        ) : (
          <p>Display results.</p>
        ) }

        {results.length !== 0 &&
        results.map(result => (
          <p>{JSON.stringify(result)}</p>
        ))}
        
      </div>
    </>
    
  )
}