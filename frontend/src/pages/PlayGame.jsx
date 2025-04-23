import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";
import { QuestionDisplay } from "../components/EditQuestionCard";

export default function PlayGame() {
  const { state } = useLocation();
  const { playerId } = useParams();
  let [sessionId] = useState(state?.sessionId);
  const [gameState, setGameState] = useState(0); // 0: waiting, 1: ongoing, 2: over
  const [loadingT, setLoadingT] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  const checkGameStatus = async () => {
    console.log('checkGameStatus')
    try {
      const { started } = await apiCall(`/play/${playerId}/status`, 'GET'); // started: Boolean
      if ( !started ) {  // not started
        setGameState(0);
      } else {  // started
        setGameState(1);
        // Fetch current question
        const { question } = await apiCall(`/play/${playerId}/question`, 'GET');
        setQuestion(question);
        setTimeLeft(question.timeLimit);
        setSelectedAnswers([]);
        setSubmitted(false);
        setResult('');
      }
    } catch (err) {  // game ended (session ended)
      console.error(err)
      setGameState(2); 
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkGameStatus();
    };
    init();
  }, [playerId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameState === 0) {
        console.log(loadingT, 'loading...');
        setLoadingT((t) => t + 1);
        checkGameStatus();
      } else if (gameState === 1) {
        checkGameStatus(); // Continue polling to detect position changes or session end
      }
    }, 500); // Poll every half second

    return () => clearTimeout(intervalId);
  }, [loadingT, gameState]);

  useEffect(() => {
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
      setResult(res.correct ? 'Correct!' : 'Incorrect');
    } catch (err) {
      console.error('Failed to fetch answer result:', err);
      setResult('Error fetching result');
    }
  };

  const submitAnswer = async answers => {
    await apiCall(`/play/${playerId}/answer`, 'PUT', { answers });
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
      // debugger
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
        {gameState === 0 && (
          <p className="text-xl">Please wait for the game to start</p>
        )}

        {gameState === 1 && question && (
          <QuestionDisplay
            questionType={question.questionType ?? 'single'}
            questionText={question.questionText ?? 'No Question'}
            timeLimit={question.timeLimit ?? 30}
            points={question.points ?? 100}
            mediaUrl={question.mediaUrl ?? ''}
            answers={question.answers ?? []}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={handleSelectAnswer}
            submitted={submitted}
            setSubmitted={setSubmitted}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            result={result}
            setResult={setResult}
            mode="answer"
          />
        )}

        {gameState === 2 && (
          <p className="text-xl">Game over</p>
        )}
      </div>
    </>
  );
}