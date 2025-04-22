import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { BackButton } from "../components/Button";
import { checkSessionState } from "../utils/session";

export default function PlayJoin() {
  const { sessionId } = useParams();
  const navigate =  useNavigate();
  const [inputSessionId, setInputSessionId] = useState('');
  const [name, setName] = useState('');

  // useEffect(() => {
  //   if (sessionId) { // Enter Name

  //   } else {  // Enter Session id first.

  //   }
  // }, [])

  const handleSubmitSessionId = async () => {
    const isActive = await checkSessionState(inputSessionId);

    if (isActive){
      navigate(`/play/join/${inputSessionId}`)
    } else {
      alert('Session unactive.');
    }
  }

  const handleSubmitName = () => {
    console.log(name)
  }

  return (
    <>
      <Navbar />
      <BackButton /> <br />
      <p>Play join</p>
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

      
    </>
  )
}