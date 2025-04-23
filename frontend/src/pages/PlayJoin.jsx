import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { BackButton } from "../components/Button";
import { checkSessionState } from "../utils/session";
import { apiCall } from "../utils/api";

export default function PlayJoin() {
  const { sessionId } = useParams();
  const navigate =  useNavigate();
  const [inputSessionId, setInputSessionId] = useState(sessionId ? String(sessionId) : '');  
  const [sessionIdSubmitted, setSessionIdSubmitted] = useState(sessionId!==undefined);
  const [name, setName] = useState('');
  const [sessionIdError, setSessionIdError] = useState(false);
  
  const handleSubmitSessionId = async () => {
    if(inputSessionId) {
      setSessionIdSubmitted(true);
      navigate(`/play/join/${inputSessionId}`)
    }
  }

  const handleSubmitName = async () => {
    try {
      const { playerId } = await apiCall(`/play/join/${sessionId}`, 'POST', {name});
      navigate(`/play/${playerId}`, { state: { sessionId } });
    } catch (error) {
      console.error('Player join session error:', error);
      setSessionIdError(true);
    }
    console.log('waiting.')
    }
    
  return (
    <>
      <Navbar onClick={()=>navigate('/play/join')}/>
      <BackButton /> <br />
      <p>Join The Game</p>
      { sessionIdSubmitted ? (
        <>
          <input type="text" value={name} placeholder="Enter Name" onChange={e => setName(e.target.value)}/>
          <button onClick={handleSubmitName}>Submit Name</button>
        </>
      ) : (
        <>
          <input type="text" value={inputSessionId} placeholder="Enter Session id" onChange={e => setInputSessionId(e.target.value)}/>
          <button onClick={handleSubmitSessionId}>Submit Session id</button>
        </>
      )}

      {/* Session Id Error Display */}
      {sessionIdError && (
        <div aria-label="Error information container" role="alert">
          {console.log('sessionIdError',sessionIdError)}
          <p>Session Id error!</p>
        </div>
      )}
      
    </>
  )
}