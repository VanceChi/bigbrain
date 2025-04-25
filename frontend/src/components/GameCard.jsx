import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../context/Sessions';
import { startSession, endSession, cleanSessions, checkSessionState } from '../utils/session';
import { queryQuestions, querySessionId } from '../utils/query';
import GlowingCard from './GlowingCard';
import { CopyBtn, EditBtn, EndBtn, PlayBtn } from './SVGBtn';




export default function GameCard({ gameId, title, numQuestions, thumbnail, totalDuration, questions }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const { activeSessions, setActiveSessions } = useContext(SessionContext);
  const [Copied, setCopied] = useState(false);
  const [showResultPop, setShowResultPop] = useState(false);
  const [infoPassedToSession, setInfoPassedToSession] = useState({});

  // check game started or not
  const initGameCard = async () => {
    cleanSessions(activeSessions, setActiveSessions, gameId);
    const isActive = await checkSessionState(undefined, gameId);
    if (isActive) {  // active
      setGameStarted(true);
      setSessionId(querySessionId(gameId));
    } else {       // unactive
      setGameStarted(false);
      setSessionId(null);
    }
    setInfoPassedToSession({ title, gameId, questions });
  }

  useEffect(() => {
    initGameCard();
  }, [])

  useEffect(() => {
    if (gameStarted === false) {
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
    if (questions.length === 0) {
      alert('Can not start game without questions!');
      return;
    }
    // start session, return session id.
    const activeSessionId = await startSession(gameId, activeSessions, setActiveSessions);

    setSessionId(activeSessionId);
    setGameStarted(true);
  }

  const handleEndGame = async () => {
    // end session, clear all session
    const res = await endSession(gameId, undefined, activeSessions, setActiveSessions);
    console.log('Game ended, res: ', res)

    // reset game card state
    const isActive = await checkSessionState(sessionId);
    if (isActive === false) {
      setCopied(false)
      setSessionId(null);
      setGameStarted(false);
      setShowResultPop(true);
    }
  }

  return (
    <GlowingCard>
      <div className='flex items-center font-bold'>
        {gameStarted ? (
          <div className="flex justify-between items-center w-full">
            <div
              className="group/end flex justify-center items-center mr-2" onClick={() => handleEndGame()}>
              <EndBtn />
              <p className='opacity-0 group-hover/end:opacity-100 font-semibold'>End</p>
            </div>
            <div>
              <Link to={`/session/${sessionId}`} state={infoPassedToSession}>
                Go session
              </Link>
            </div>
            <div className="group/copy flex justify-center items-center" onClick={handleCopyLink}>
              <p>Id:{sessionId}</p>
              <CopyBtn />
            </div>
          </div>
        ) : (
          <div className='flex place-content-between w-full'>
            <div
              className="group/start flex justify-center items-center mr-2"
              onClick={() => handleStartGame(gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId)}>
              <PlayBtn />
              <p className='opacity-0 group-hover/start:opacity-100' >Start</p>
            </div>
            <div>
              {showResultPop && (
                <Link to={`/session/:${sessionId}`} state={infoPassedToSession} className='italic font-normal hover:cursor-pointer hover:underline decoration-red-500'>View Game Results</Link>
              )}
            </div>
          </div>
        )}
      </div>
      <div className='flex justify-center'>
        <h4 className="font-bold text-2xl">{title}</h4>
      </div>
      <div className='p-2 flex items-center place-content-between text-[10px] '>
        <img src={thumbnail} alt={`${title} thumbnail`} className="w-16 h-16 rounded" />
        <table className="table-fixed w-[45%]">
          <tbody className="text-sm text-gray-600 font-medium">
            <tr>
              <td>Questions:</td>
              <td>{numQuestions}</td>
            </tr>
            <tr>
              <td>Duration:</td>
              <td>{totalDuration} s</td>
            </tr>
          </tbody>
        </table>
        <div>
          <Link
            to={`/game/${gameId}`}
            state={{ title, thumbnail, questions }}
          >
            <EditBtn />
          </Link>
          <br />
          <br />
        </div>
      </div>

    </GlowingCard>
  );
}