import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../context/Sessions';
import { startSession, endSession, checkSessionState } from '../utils/session';
import { queryQuestions, querySessionId } from '../utils/query';
import GlowingCard from './GlowingCard';
import { CopyBtn, EditBtn, EndBtn, PlayBtn } from './SVGBtn';
import { gameHandler } from '../temp/gameIdHandler';


export default function GameCard({ gameId, title, numQuestions, thumbnail, totalDuration, questions }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const { activeSessions, setActiveSessions } = useContext(SessionContext);
  const [Copied, setCopied] = useState(false);
  const [showResultPop, setShowResultPop] = useState(false);
  const [infoPassedToSession, setInfoPassedToSession] = useState({});
  const gH = gameHandler(gameId);
  
  // check game started or not
  const initGameCard = async () => {
    const isActive = await checkSessionState(undefined, gameId);
    if (isActive) {  // active
      setGameStarted(true);
    } else {       // unactive
      setGameStarted(false);
    }
    const sessionId = querySessionId(gameId);
    setSessionId(sessionId);
    setInfoPassedToSession({ title, gameId, questions });

    const showResultPop = activeSessions.map(s => s.gameId).includes(gameId);;
    setShowResultPop(showResultPop);
  }

  useEffect(() => {
    initGameCard();
  }, [])

  useEffect(() => {
    setInfoPassedToSession({ title, gameId, questions })
  }, [title, gameId, questions])

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
    await endSession(gameId, undefined, activeSessions);

    // reset game card state
    const isActive = await checkSessionState(sessionId);
    if (isActive === false) {
      setCopied(false)
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
              className="group/end flex justify-center items-center mr-2">
              <EndBtn onClick={() => handleEndGame()} />
              <p className='opacity-0 group-hover/end:opacity-100 font-semibold text-bigbrain-dark-pink'>End</p>
            </div>
            <div>
              <Link to={`/session/${sessionId}`} state={infoPassedToSession}>
                Active! Go session
              </Link>
            </div>
            <div className="group/copy flex justify-center items-center" onClick={handleCopyLink}>
              <p>Id:{sessionId}</p>
              <CopyBtn />
              {Copied && <p className='text-[6px]'>&#x2714;</p>}
            </div>
          </div>
        ) : (
          <div className='flex place-content-between w-full'>
            <div className="group/start flex justify-center items-center mr-2">
              <PlayBtn
                onClick={() => handleStartGame(gameId, setGameStarted, activeSessions, setActiveSessions, setSessionId)}
              />
              <p className='opacity-0 group-hover/start:opacity-100 text-bigbrain-dark-pink' >Start</p>
            </div>
            <div>
              {showResultPop && (
                <Link to={`/session/${sessionId}`} state={infoPassedToSession} className='italic font-normal hover:cursor-pointer hover:underline decoration-red-500'>View Game Results</Link>
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