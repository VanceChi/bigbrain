import { Link } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { useEffect, useState } from 'react';

const handleStartGame = async (gameId, setGameStarted, setSessionId) => {
  console.log('start gameId: ' + gameId)
  const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', {
    "mutationType": "START"
  })
  setSessionId(res.data.sessionId);
  console.log('start game res: ', res)
  setGameStarted(true);
}

const handleEndGame = async (gameId, setGameStarted) => {
  console.log('start game: ' + gameId)
  const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', {
    "mutationType": "END"
  })
  console.log('end game res: ', res)
  setGameStarted(false);
}

export default function GameCard({gameId, title, numQuestions, thumbnail, totalDuration, questions}) {
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    console.log('sessionId:', sessionId);
    const fetchSessionStatus = async () => {
      const res = await apiCall(`/admin`)
      
    }
    fetchSessionStatus();
  }, [sessionId])

  return (
    <div className="p-2 bg-white rounded-2xl shadow-md items-center space-x-4">
      <div className='flex items-center'>
        {gameStarted? (
          <>
            <button onClick={() => handleEndGame(gameId, setGameStarted)}>End Game</button> &nbsp;&nbsp;&nbsp;
            <p className='text-sm'>Copy Link</p>
          </>
        ) : (
          <button onClick={() => handleStartGame(gameId, setGameStarted, setSessionId)}>Start Game</button>
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