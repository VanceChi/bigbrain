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
  const {state} = useLocation();  // keys: title, gameId, questions
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState();
  const [position, setPosition] = useState(-1);  // -1: not start yet
  const [question, setQuestion] = useState({});  // -1: not start yet

  useEffect(() => {
    const init = async () => {
      // set session active or not
      const isActive = await checkSessionState(sessionId);
      setActive(isActive);

      // set gameId
      setGameId(state.gameId);

      // set title
      setTitle(state.title);

    }
    init();
  }, [])

  // Since cant restart session. The effect here means active -> unactive
  // Shows result.
  useEffect(() => {
    const loadResult = async () => {
      const res = await apiCall(`/admin/session/${sessionId}/results`, 'GET'); //{results: Array(0)}
      setResults(res.results);
      debugger
    }

    
    getStatus();
    
  }, [active])

  
  const getStatus = async () => {
    const res = await apiCall(`/admin/session/${sessionId}/status`, 'GET')
    const results = res.results;
    const position = results.position;
    const question = results.questions[position];
    setPosition(position);
    setResults(results);
    setQuestion(question);
    console.log('----------')
    console.log(results)
    console.log(position)
    console.log(question);
  }
  
  const handleEndSession = () => {
    endSession(undefined, sessionId, activeSessions, setActiveSessions);
  }

  const hanleAdvanceQuestion = async () => {
    const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', { "mutationType": "ADVANCE" });
  }

  return (
    <>
      <Navbar />
      <BackButton />
      <button className="border" onClick={getStatus}>Get Status</button>
      {active? (
        <p>Session active</p>
      ) : (
        <p>Session unactive</p>
      )}
      <p>Session of {title}: {sessionId}</p>
      <button className="border" onClick={hanleAdvanceQuestion}>Advance Question</button>
      <button onClick={handleEndSession} className="border">End Session</button>
      <div className="border">
        {question ? (
          <p>{JSON.stringify(question)}</p>
        ) : (
          <p>Not start yet</p>
        )}
      </div>
    </>
    
  )
}