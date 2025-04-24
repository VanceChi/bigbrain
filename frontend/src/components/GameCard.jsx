import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../context/Sessions';
import { startSession, endSession, cleanSessions, checkSessionState } from '../utils/session';
import { queryQuestions, querySessionId } from '../utils/query';




export default function GameCard({gameId, title, numQuestions, thumbnail, totalDuration, questions}) {
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const {activeSessions, setActiveSessions} = useContext(SessionContext);
  const [Copied, setCopied] = useState(false);
  const [showResultPop, setShowResultPop] = useState(false);
  const [infoPassedToSession, setInfoPassedToSession] = useState({});
  
  // check game started or not
  const initGameCard = async () => {
    cleanSessions(activeSessions, setActiveSessions, gameId);
    const isActive = await checkSessionState(undefined, gameId);
    if (isActive){  // active
      setGameStarted(true);
      setSessionId(querySessionId(gameId));
    } else {       // unactive
      setGameStarted(false);
      setSessionId(null);
    }
    setInfoPassedToSession({title, gameId, questions});
  }

  useEffect(() => {
    initGameCard();
  }, [])

  useEffect(() => {
    if (gameStarted === false){
    }
  }, [gameStarted])
  
  const handleCopyLink = async () => {
    try {
      // Construct the link to copy (e.g., a URL for the game session)
      const link = `${window.location.origin}/play/join/${sessionId}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link to clipboard.');
    }
  };

  // It must be quesitons to start.
  const handleStartGame = async (gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId) => {
    console.log('start gameId: ' + gameId)

    // check if questions exist
    const questions = await queryQuestions(gameId);
    if (questions.length === 0){
      alert('Can not start game without questions!');
      return ;
    }
    // start session, return session id.
    const activeSessionId = await startSession(gameId, activeSessions, setActiveSessions);

    setSessionId(activeSessionId);
    setGameStarted(true);
  }
    
  const handleEndGame = async () => {
    // end session, clear all session
    const res = await endSession(gameId, undefined, activeSessions, setActiveSessions);
    console.log('Game ended.')

    // reset game card state
    const isActive = await checkSessionState(sessionId);
    if (isActive === false){
      setCopied(false)
      setSessionId(null);
      setGameStarted(false);
      setShowResultPop(true);
    }
  }

  return (
    <div className="p-2 bg-white rounded-2xl shadow-md items-center space-x-4">
      {/* <button onClick={() => cleanSessions(activeSessions, setActiveSessions)}>Clean Session</button> */}
      <div className='flex items-center'>
        {gameStarted? (
          <>
            <button 
              onClick={() => handleEndGame()}>End Game
            </button> &nbsp;&nbsp;&nbsp;
            <Link to={`/session/${sessionId}`} state={infoPassedToSession}>Go to session.</Link>&nbsp;&nbsp;&nbsp;

            <button className='text-sm' onClick={handleCopyLink}>{Copied?'Copied':'Click to Copy Link:'}
            </button>
            <p>{sessionId}</p>
          </>
        ) : (
          <>
            <button onClick={() => handleStartGame(gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId)}>Start Game</button>
            {showResultPop && (
              <Link to={`/session/:${sessionId}`} state={infoPassedToSession}>Would you like to view the results?</Link>
            )}
          </>
        )}
      </div>
      <h4 className="text-lg font-bold">{title}</h4>
      <div className='p-2 bg-white flex items-center space-x-4 text-sm'>
        <img src={thumbnail} alt={`${title} thumbnail`} className="w-16 h-16 rounded" />
        <div>
          <p className="text-sm text-gray-600">{numQuestions} questions</p>
          <p className="text-sm text-gray-600">Total Duration: {totalDuration} seconds</p>
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