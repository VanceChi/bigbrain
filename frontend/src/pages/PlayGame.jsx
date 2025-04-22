import { useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import { checkSessionState } from "../utils/session";
import { BackButton } from "../components/Button";

export default function PlayGame() {
  const { state } = useLocation();
  const [sessionId] = useState(state.sessionId);
  const [active, setActive] = useState(false);
  const [loadingT, setLoadingT] = useState(0);

  useEffect(() => {
    const isActive = checkSessionState(sessionId);
    setActive(isActive);
  }, [])

  // if inactive
  useEffect(() => {
    if (active === false){
      console.log('loading...')
    }
  }, [loadingT])

  return (
    <>
      <Navbar />
      <BackButton />
      <p>Play Game</p>
      {active ? (
        <p>active</p>
      ) : (
        <p>inactive</p>
      )}
    </>
    
  )
}