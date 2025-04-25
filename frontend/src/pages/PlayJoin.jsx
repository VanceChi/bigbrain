import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";
import { BackBtn } from "../components/SVGBtn";

export default function PlayJoin() {
  const { sessionId } = useParams();
  const navigate =  useNavigate();
  const [inputSessionId, setInputSessionId] = useState(sessionId ? String(sessionId) : '');  
  const [sessionIdSubmitted, setSessionIdSubmitted] = useState(sessionId!==undefined);
  const [name, setName] = useState('');
  const [sessionIdError, setSessionIdError] = useState(false);
  const [inputError, setInputError] =useState('');
  
  const handleSubmitSessionId = async () => {
    if (!inputSessionId)
      setInputError('Input session Id!')
    setInputError('');
    if(inputSessionId) {
      setSessionIdSubmitted(true);
      navigate(`/play/join/${inputSessionId}`)
    }
  }

  const handleSubmitName = async () => {
    if (!name) 
      setInputError('Input name!')
    setInputError('');
    try {
      const { playerId } = await apiCall(`/play/join/${sessionId}`, 'POST', {name});
      navigate(`/play/${playerId}`, { state: { sessionId } });
      setInputError('');
    } catch (error) {
      console.error('Player join session error:', error);
      setInputError(error.message);
    }
    console.log('waiting.')
    }
    
  return (
    <>
      <Navbar/>
      <BackBtn onClick={()=> {
        navigate('/play/join');
        setSessionIdSubmitted(false);
      }}/>
      <div className="bg-bigbrain-milky-canvas rounded-3xl shadow-2xl  h-[600px] p-10 m-5">
        <div aria-label="Title" className="place-items-center">
          <p className="text-2xl font-bold mb-4 italic">Join The Game</p>
        </div>
        <div className=" m-10flex place-items-center">
          <div aria-label="input-session-id" className="flex place-content-center">
            { sessionIdSubmitted ? (
              <div className="m-10 mt-30">
                <p className="text-[25px] font-bold mb-4 italic">Give your name here !</p>
                <div aria-label="input-name" className="mt-10">
                  <input 
                    type="text" 
                    value={name} 
                    placeholder="Enter Name" 
                    onChange={e => setName(e.target.value)}
                    className="border-2 rounded-md mr-4 h-[50px]"
                  />
                  <button 
                    onClick={handleSubmitName}
                    className="border h-full p-3 rounded-2xl text-black font-bold hover:cursor-pointer hover:bg-bigbrain-light-pink hover:text-white"
                  >Submit</button>
                </div>
              </div>
            ) : (
              <div aria-label="input-name" className="mt-30">
                <p className="text-[25px] font-bold mb-4 italic">
                  Give Session Id here !
                </p>
                <div aria-label="input-name" className="mt-10">
                  <input 
                    type="text" 
                    value={inputSessionId} 
                    placeholder="Enter Session id" 
                    onChange={e => setInputSessionId(e.target.value)}
                    className="border-2 rounded-md mr-4 h-[50px]"
                  />
                  <button 
                      onClick={handleSubmitSessionId}
                      className="border p-3 rounded-2xl text-black font-bold hover:cursor-pointer hover:bg-bigbrain-light-pink hover:text-white"
                  >Submit
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Session Id Error Display */}
          {inputError && (
            <div aria-label="Error information container" role="alert" className="m-10">
              <p className="text-red-900 font-bold">{inputError}</p>
            </div>
          )}
        </div>
      </div>
      
    </>
  )
}