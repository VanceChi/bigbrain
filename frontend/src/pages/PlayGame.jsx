import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";
import { QuestionDisplay } from "../components/EditQuestionCard";
import { playGetQuestion, playGetResult, playGetStatus } from "../services/playerService";

export default function PlayGame() {
  const { state } = useLocation();
  const { playerId } = useParams();
  let [sessionId] = useState(state?.sessionId);
  const [gameState, setGameState] = useState(-3);
  /**
     -3: Default value.
     -2: playerId invalid.
     -1: Session ended.
      0: Waiting. Game not started, session active.
      1: Game ongoing.
   */
  const [question, setQuestion] = useState(null);
  const [questionId, setQuestionId] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [quesResult, setQuesResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameResult, setGameResult] = useState([]);
  const navigate = useNavigate();

  /**
   * updateGameStatus every 0.5s
   */
  const updateGameStatus = async () => {
    const gameState = await playGetStatus(playerId); // started: Boolean
    setGameState(gameState);

    // 1. Waiting. Game not started, session active.
    if ( gameState === 0 ) {
      console.log('loading...');

    // 2. Game ongoing.
    } else if (gameState === 1) {
      const question = await playGetQuestion(playerId);
      // next question
      if (question.id !== questionId) {
        setQuestionId(question.id);
        setQuestion(question);
        setQuesResult('');
        setTimeLeft(question.duration);
        setSubmitted(false);
      }
    
    // 3. Session just ended.
    } else if (gameState === -1) {
      const result = await playGetResult(playerId);
      setGameResult(result);

    // Error: invalid playerId
    } else if (gameState === -2) {    
      console.error('Invalid playerId');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateGameStatus();
      if (gameState === -1){
        return clearInterval(intervalId);
      }
    }, 500); // Poll every half second

    return () => clearInterval(intervalId);
  }, [questionId, gameState, timeLeft]);  // Refresh cache

  useEffect(() => {
    console.log('timeLeft--' ,timeLeft)
    if (gameState === 1 && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSubmitted(true);
            fetchAnswerResult();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted, gameState]);

  const fetchAnswerResult = async () => {
    try {
      const res = await apiCall(`/play/${playerId}/answer`, 'GET');
      setQuesResult(res.correct ? 'Correct!' : 'Incorrect');
    } catch (err) {
      console.error('Failed to fetch answer result:', err);
      setQuesResult('Error fetching result');
    }
  };

  const submitAnswer = async answers => {
    try {
      const res = await apiCall(`/play/${playerId}/answer`, 'PUT', { answers });
      if (res.error) console.error(res.error);
    } catch (err) {
      console.error(err);
    }
    
    
  }

  /**
   * Whenever operation done, handle it.
   * 
   * @param {*} answer 
   */
  const handleSelectAnswer = async (answer) => {
    setSelectedAnswers(answer);
    try {
      const sentAnswer = answer.map(a=>a.text);
      await submitAnswer(sentAnswer);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };


  return (
    <>
      <Navbar />
      {sessionId && <BackButton onClick={() => {
        navigate(`/play/join`);
      }}/>}
      <div className="p-4">
        {/*  Waiting. Game not started, session active. */}
        {gameState === 0 && (  
          <p className="text-xl">Please wait for the game to start</p>
        )}

        {/* Game ongoing. */}
        {gameState === 1 && question && (
          <QuestionDisplay
            questionType={question.questionType ?? 'single'}
            questionText={question.questionText ?? 'No Question'}
            duration={question.duration ?? 30}
            points={question.points ?? 100}
            mediaUrl={question.mediaUrl ?? ''}
            answers={question.answers ?? []}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={handleSelectAnswer}
            submitted={submitted}
            setSubmitted={setSubmitted}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            result={quesResult}
            setResult={setQuesResult}
            mode="answer"
          />
        )}

        {/* Session ended. */}
        {gameState === -1 && (
          <div aria-label="game-results">
            <p className="text-xl">Game over</p>
            <p>{JSON.stringify(gameResult)}</p>
          </div>
          
        )}
      </div>
    </>
  );
}