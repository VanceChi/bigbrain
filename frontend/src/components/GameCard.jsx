import { Link } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../context/Sessions';
import { startSession, endSession, cleanSessions } from '../utils/session';
import { queryQuestions } from '../utils/query';

// It must be quesitons to start.
const handleStartGame = async (gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId) => {
  console.log('start gameId: ' + gameId)

  // check if questions exist
  const questions = await queryQuestions(gameId);
  if (questions.length === 0){
    alert('Can not start game without questions!');
    return
  }
  // start session, return session id.
  const activeSessionId = await startSession(gameId, activeSessions, setActiveSessions);

  setSessionId(activeSessionId);
  setGameStarted(true);
}

const handleEndGame = async (gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId) => {
  
  // end session, clear all session
  const res = await endSession(gameId, activeSessions, setActiveSessions);
  console.log('end game res: ', res)

  setSessionId(null);
  setGameStarted(false);
}


export default function GameCard({gameId, title, numQuestions, thumbnail, totalDuration, questions}) {
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const {activeSessions, setActiveSessions} = useContext(SessionContext);
  
  /**
   * Given activeSessions, sessionId, setActiveSessions from outside.
   */
  const delSessionLocal = () => {
    const updatedSession = activeSessions.filter((session)=>session.activeSessionId != sessionId)
    setActiveSessions(updatedSession);
    localStorage.setItem('activeSessions', JSON.stringify(updatedSession));
  }

  useEffect(() => {
    const fetchGameSessionStatus = async () => {
      const session = activeSessions.find(session=>session.gameId==gameId);
      if (session){
        const sessionId = session.activeSessionId;
        const res = await apiCall(`/admin/session/${sessionId}/status`, 'GET');
        const active = res.results.active;
        console.log('active:', active)
        // debugger
        if (active){
          return true;
        }else{
          delSessionLocal();
          return false;
        }
      } else {
        return false;
      }
    }
    const initSessionStatus = async () => {
      const gameStarted = await fetchGameSessionStatus();
      setGameStarted(gameStarted);
    }

    initSessionStatus();
  }, [])
  
  return (
    <div className="p-2 bg-white rounded-2xl shadow-md items-center space-x-4">
      <button onClick={() => cleanSessions(activeSessions, setActiveSessions)}>Clean Session</button>
      <div className='flex items-center'>
        {gameStarted? (
          <>
            <button onClick={() => handleEndGame(gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId)}>End Game</button> &nbsp;&nbsp;&nbsp;
            <p className='text-sm'>Copy Link</p>
          </>
        ) : (
          <button onClick={() => handleStartGame(gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId)}>Start Game</button>
        )}
      </div>
      <h4 className="text-lg font-bold">{title}</h4>
      <div className='p-2 bg-white flex items-center space-x-4 text-sm'>
        <img src={thumbnail} alt={`${title} thumbnail`} className="w-16 h-16 rounded" />
        <div>
          <p className="text-sm text-gray-600">{numQuestions} questions</p>
          <p className="text-sm text-gray-600">Duration: {totalDuration} seconds</p>
        </div>
        <div>
          <Link 
            to={`/game/${gameId}`}
            state={{title, thumbnail, questions}}
            >Edit Game
          </Link>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}