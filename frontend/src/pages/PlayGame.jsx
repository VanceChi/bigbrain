import { useLocation, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import { checkSessionState } from "../utils/session";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";

export default function PlayGame() {
  const { state } = useLocation();
  const { playerId } = useParams();
  const [sessionId] = useState(state.sessionId);
  const [active, setActive] = useState(true);
  const [started, setStarted] = useState(false);
  const [loadingT, setLoadingT] = useState(0);

  const gameStarted = async () => {
    try {
      const { started } = await apiCall(`/play/${playerId}/status`, 'GET');
      console.log('started', started);
      setStarted(started);
      setActive(true);
    } catch (error) {
      console.log('error', error);
      setActive(false);
    }
  }
  
  useEffect(() => {
    const init = async () => {
      console.log('init.')
      gameStarted();
      const isActive = await checkSessionState(sessionId);
      console.log('-----', isActive)
      setActive(isActive);  
    }
    
    init();
  }, [])

  const fetch = () => {
    const timeoutId = setTimeout(() => {
      console.log(loadingT, 'loading...')
      setLoadingT(loadingT => loadingT + 1);
      gameStarted();
      checkSessionState(sessionId)
        .then(isActive => setActive(isActive));
    }, 100)

    return timeoutId;
  }

  // if inactive
  useEffect(() => {
    console.log(started, active);
    if (!started && active){
        const timeoutId = fetch();
        return () => clearTimeout(timeoutId);
    }
  }, [loadingT])

  return (
    <>
      <Navbar />
      <BackButton />
      <p>Play Game</p>
      {active ? (
        <p>session active</p>
      ) : (
        <p>session inactive</p>
      )}

      {started ? (
        <p>game started</p>
      ) : (
        <p>game not started</p>
      )}
    </>
    
  )
}