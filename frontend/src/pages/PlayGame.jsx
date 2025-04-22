import { useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import { checkSessionState } from "../utils/session";
import { BackButton } from "../components/Button";

export default function PlayGame() {
  const { state } = useLocation();
  const [sessionId] = useState(state.sessionId);
  const [active, setActive] = useState();

  useEffect(() => {
    const isActive = checkSessionState(sessionId);
    setActive(isActive);
  }, [])

  return (
    <>
      <Navbar />
      <BackButton />
      <p>Play Game</p>
      {active? (
        <p>active</p>
      ) : (
        <p>inactive</p>
      )}
    </>
    
  )
}