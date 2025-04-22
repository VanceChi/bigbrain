import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { BackButton } from "../components/Button";
import { checkSessionState } from "../utils/session";
import { apiCall } from "../utils/api";

export default function PlayJoin() {
  const { sessionId } = useParams();
  const navigate =  useNavigate();
  const [inputSessionId, setInputSessionId] = useState('');
  const [name, setName] = useState('');
  const [active, setActive] = useState(false);

  // useEffect(() => {
  //   if (sessionId) { // Enter Name

  //   } else {  // Enter Session id first.

  //   }
  // }, [])

  const handleSubmitSessionId = async () => {
    navigate(`/play/join/${inputSessionId}`)
  }

  const handleSubmitName = async () => {
    console.log('Name Submitted. Name, sessionId:', name, sessionId);
    let isActive = await checkSessionState(sessionId);
    console.log('After submit name, session state:', isActive)
    if (isActive) { // session active, join session.
      try {
        const res = await apiCall(`/play/join/${sessionId}`, 'POST', {name});  // res.playerId
        const playerId = res.playerId;
        navigate(`/play/${playerId}`, { state: { sessionId } });
      } catch (error) {
        console.error('Player join session error:', error);
      }
    } else { // session inactive, waiting
      console.log('waiting.')
      
      while (!isActive){
        // keep polling  
        setTimeout(async () => {
          isActive = await checkSessionState(sessionId);
          console.log('polling result:', isActive);
        }, 100)
        
      }
    }
  }

  /**
   * If Active, play the game.
   * If inactive, waiting.
   */
  const listenState = () => {

  }

  return (
    <>
      <Navbar />
      <BackButton /> <br />
      <p>Join The Game</p>
      {sessionId?(
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
      {

      }

      
    </>
  )
}