import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";
import { QuestionDisplay } from "../components/EditQuestionCard";
import { playGetQuestion, playGetResult, playGetStatus } from "../services/playerService";
import { BackBtn } from "../components/SVGBtn"

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
  const [questions, setQuestions] = useState([]);
  const [questionId, setQuestionId] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [quesResult, setQuesResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameResult, setGameResult] = useState([]);
  const [pointsGot, setPointsGot] = useState([]);
  const navigate = useNavigate();

  /**
   * updateGameStatus every 200ms
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
        setQuestions(q => [...q, question]);
        setQuesResult('');
        setTimeLeft(question.duration);
        setSubmitted(false);
      }
    
    // 3. Session just ended.
    } else if (gameState === -1) {
      const gameResult = await playGetResult(playerId);
      setGameResult(gameResult);
      // generate pointsGot: Arrary [[questionText, points], ...], points: '**/**'
      const pointsGot = [];
      for (let i=0; i<questions.length; i++){
        const q = questions[i];
        const r = gameResult[i];
        let ansTime = new Date(r.answeredAt) - new Date(r.questionStartedAt);
        ansTime = Math.round(ansTime/100)/10;
        ansTime = ansTime==0?'no answer':ansTime;
        pointsGot.push([q.questionText, [q.points*r.correct, q.points], ansTime])
      }
      setPointsGot(pointsGot);

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
    }, 200); // Poll every 200ms

    return () => clearInterval(intervalId);
  }, [questionId, gameState, timeLeft]);  // Refresh cache

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
  }, [timeLeft, submitted, gameState, questions, gameResult]);

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
      console.log('answer:', answer);
      console.log('sentAnswer:', sentAnswer);
      await submitAnswer(sentAnswer);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };


  return (
    <>
      <Navbar />
      {sessionId && <BackBtn onClick={() => {
        navigate(`/play/join`);
      }}/>}
      <div className="p-4">
        {/*  Waiting. Game not started, session active. */}
        {gameState === 0 && (
          <div className="flex place-content-center">
            <p className="text-xl font-bold">Please wait for the game to start...</p>
          </div>
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
            <div aria-label="question-points-aquired">
              <table className="table-auto">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Score</th>
                    <th>Seconds</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsGot.map((r, index) => (
                    <tr key={index}>
                      <td className="border p-2">{r[0]}</td>
                      <td className="border p-2">{r[1][0]+'/'+r[1][1]}</td>
                      <td className="border p-2">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {console.log(pointsGot[0], typeof pointsGot[0])}
              <p>Total points: {pointsGot.map(r=>r[1][0]).reduce((a, b) => a + b, 0)}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}