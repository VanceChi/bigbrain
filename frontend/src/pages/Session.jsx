import { useLocation, useNavigate, useParams } from "react-router-dom"
import { endSession } from "../utils/session";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/Sessions";
import { apiCall } from "../utils/api";
import { QuestionDisplay } from "../components/EditQuestionCard";
import { queryQuestions } from "../utils/query";
import { BackBtn } from "../components/SVGBtn";
import { EndBtn } from "../components/SVGBtn";
import { adminGet_gameState, adminGetGameResult, adminGetSessionStatus } from "../services/adminSessionService";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';


function AdvanceQuesBtn({ children, title, onClick }) {
  return (
    <button
      className="m-2 bg-bigbrain-light-pink text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-1.5 mb-2 rounded-3xl inline-block"
      onClick={onClick}
      title={title}
    >
      <p className="font-medium text-[15px]/1 p-3">
        {children}
      </p>
    </button>
  )
}

const ChartTitle = ({ children }) => {
  return (
    <p className="font-bold">
      {children}
    </p>
  )
}

export default function Session() {
  const navigate = useNavigate();
  const { activeSessions } = useContext(SessionContext);
  const { sessionId } = useParams();
  const { state } = useLocation();  // keys: title, gameId, questions
  const title = state.title;
  const gameId = state.gameId;
  const [gameState, setGameState] = useState(-5);
  /**
     -5: Default value.
     -4: Session id error.
     -3: Session finished. No player result.
     -2: Session finished. Show result.
     -1: Waiting. Game not started, session active.
      0: question index 0.  Game ongoing.
      1: question index 1.  Game ongoing.
      ...
   */
  // -1: not start yet
  const [question, setQuestion] = useState({});
  const [quesitons, setQuestions] = useState([]);
  const [nOfQuestions, setNOfQuestions] = useState(0);
  const [scoreTable, setScoreTable] = useState([]);
  const [correctRateTable, setCorrectRateTable] = useState([]);
  const [ansTime, setAnsTime] = useState([]);
  const correctRateSetting = {
    xAxis: [
      {
        label: 'correct rate',
      },
    ],
    height: 200,
  };

  useEffect(() => {
    const init = async () => {
      console.log('initial session.');

      update_gameState();
    }
    init();
  }, [])

  /**
   * Only for update "gameState".
   */
  const update_gameState = async () => {
    console.log('updateGameStatus');
    const gameState = await adminGet_gameState(sessionId);
    setGameState(gameState);
  }

  useEffect(() => {
    if (gameState !== -5)
      updatePage();
  }, [gameState])

  /**
   * Generate customize answering results:
   *    ansResults, scoreTable, correctRate, respond time
   * 
   * ansResults:
    * Three dimesion: question, player, {correct, time, points, playerName, questionText}
    * [
    *  [   q1
    *    [correct, time] player1
    *    [correct, time] player2
    *  ],
    *  [   q2
    *    [correct, time] player1
    *    [correct, time] player2
    *  ]  
    * ]
    * 
    * scoreTable [score1, score2,...] index: player
    * correctRate [rate1, rate2,...] index: question
   * @returns {undefined}
   */
  const loadResult = async () => {
    console.log('load result.')

    const resResults = await adminGetGameResult(sessionId);
    const nOfQuestions = resResults[0].answers.length;
    const questions = await queryQuestions(gameId);
    const nOfPlayers = resResults.length;

    // ansResults
    const ansResults = [];
    for (let i = 0; i < nOfQuestions; i++) {  // question
      const qArr = [];
      const points = questions[i].points;
      const questionText = questions[i].questionText;
      for (let j = 0; j < nOfPlayers; j++) {  // player
        const p = resResults[j];
        const correct = p.answers[i].correct;
        const time = new Date(p.answers[i].answeredAt) - new Date(p.answers[i].questionStartedAt);
        const playerName = p.name;
        qArr.push({ correct, time, points, playerName, questionText });
      }
      ansResults.push(qArr);
    }

    try {
      // calculate scoreTable
      let scoreTable = [];  // [[name, score], ...]
      for (let p = 0; p < nOfPlayers; p++) {
        let score = 0;
        for (let q = 0; q < nOfQuestions; q++) {
          score += ansResults[q][p].points * ansResults[q][p].correct;
        }
        scoreTable.push([ansResults[0][p].playerName, score]);
      }

      scoreTable.sort((s1, s2) => s2[1] - s1[1]);
      setScoreTable(scoreTable);

      // correct rate
      const correctRate = []; // index: question
      const questionsText = []; // index: question
      for (let q = 0; q < nOfQuestions; q++) {
        let correctN = 0;
        questionsText.push(ansResults[q][0].questionText);
        for (let p = 0; p < nOfPlayers; p++) {
          correctN += ansResults[q][p].correct;
        }
        correctRate.push(correctN / nOfPlayers);
      }
      setCorrectRateTable({ correctRate, questionsText });

      // respond time
      const ansTime = [];
      for (let q = 0; q < nOfQuestions; q++) {
        let respondTime = 0;
        for (let p = 0; p < nOfPlayers; p++) {
          respondTime += ansResults[q][p].time;
        }
        respondTime /= 100 * nOfPlayers;
        respondTime = Math.round(respondTime) / 10;

        ansTime.push({ value: respondTime, label: ansResults[q][0].questionText })
      }
      setAnsTime(ansTime);

    } catch (err) {
      console.log(err);
    }
  }

  const updatePage = async () => {
    console.log('update page.')
    if (gameState === -5) {
      console.error('gameState didnt updated.')
    } else if (gameState === -4) {
      console.error('Session Id error.');
    } else if (gameState === -3) {
      console.log('No player answerred.')
    } else if (gameState === -2) {
      loadResult();
    } else if (gameState >= 0) {
      loadQuestion();
    }
  }

  const loadQuestion = async () => {
    const results = await adminGetSessionStatus(sessionId);
    const questions = results.questions;
    setQuestions(quesitons);
    setNOfQuestions(questions.length);
    const curQuestion = questions[gameState];
    setQuestion(curQuestion);
  }

  const handleEndSession = async () => {
    try {
      await endSession(undefined, sessionId, activeSessions);
      update_gameState();
    } catch (error) {
      console.log(error);
    }
  }

  const hanleAdvanceQuestion = async () => {
    await apiCall(`/admin/game/${gameId}/mutate`, 'POST', { "mutationType": "ADVANCE" });
    update_gameState();
  }


  return (
    <>
      <BackBtn onClick={() => navigate('/dashboard')} />

      {/* Session state title */}
      <div className="flex justify-center">
        {gameState >= -1 ? (
          <div className="flex place-content-between w-[200px]">
            <EndBtn onClick={handleEndSession} />
            <div className="relative group w-1xs">
              <div className="absolute -inset-0.5 rounded-2xl bg-[linear-gradient(90deg,#800080,#ff0000,#ffff00)] bg-[length:200%_50%] 
                  animate-[var(--animation-gradient-glow)] blur-sm opacity-10">
              </div>
              <div className="italic font-bold text-lg/8 inline-block p-3 text-shadow-2xs">
                Session active
              </div>
            </div>
          </div>
        ) : (
          <p className="italic font-bold text-lg/8 inline-block p-3 text-shadow-2xs">Session Ended</p>
        )}
      </div>

      {/* Session Info */}
      <div className="flex justify-center">
        <p className="italic font-medium text-lg/8 p-3">Session of {title} ---- session id: {sessionId}</p>
      </div>

      {/* Control Center */}
      {gameState > -2 && (
        <div
          aria-label="Control-center"
          className=" bg-bigbrain-milky-canvas m-4 border-[1.5px] rounded-xl p-3"
        >
          {gameState === -1 && (
            <>
              <AdvanceQuesBtn onClick={hanleAdvanceQuestion}>Start !</ AdvanceQuesBtn>
            </>
          )}
          {gameState >= 0 && (
            <>
              <AdvanceQuesBtn title="Click to go next question" onClick={hanleAdvanceQuestion}>
                Next
              </ AdvanceQuesBtn>
              <p className="inline-block font-bold ml-2">
                {-1 < gameState && `Questions: ${gameState + 1} / ${nOfQuestions}`}
              </p>
            </>
          )}
        </div>)}

      {/* Show question */}
      <div className="bg-bigbrain-milky-canvas p-8 pt-4 shadow-lg shadow-grey m-3 rounded-2xl">
        {gameState === -1 && (
          <p className="inline-block font-medium text-[20px]/1 p-3 mt-3">Game Wait to Start...</p>
        )}
        {gameState >= 0 && Object.keys(question).length !== 0 && (
          <>
            <p className="inline-block font-medium text-[15px]/1 p-3">(You can not answer)</p>
            <QuestionDisplay
              questionType={question.questionType}
              questionText={question.questionText}
              duration={question.duration}
              points={question.points}
              mediaUrl={question.mediaUrl}
              answers={question.answers}
              selectedAnswers={[]}
              setSubmitted={() => console.log('Finished.')}
              setSelectedAnswers={() => console.log('You can not answer here.')}
              setResult={() => console.log('setResult.')}
              mode={'observe'}
            />
          </>
        )}

        {/* Session finished. Show result. */}
        {gameState === -2 && Object.keys(correctRateTable).length !== 0 && (
          <div className="mt-4">
            <div aria-label="score-container" className="border rounded-2xl p-5">
              <ChartTitle>Score:</ChartTitle>
              <table className="table-auto w-[100%]">
                <thead>
                  <tr>
                    <th className="font-semibold">Name</th>
                    <th className="font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreTable.slice(0, 5).map((score, index) => (
                    <tr key={index}>
                      <td className="border p-1 pl-3">{score[0]}</td>
                      <td className="border p-1 pl-3">{score[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 border rounded-2xl p-4">
              <ChartTitle>Correct Rate</ChartTitle>
              <BarChart
                yAxis={[
                  {
                    id: 'Correct Rate',
                    data: correctRateTable.questionsText,
                    scaleType: 'band',
                  },
                ]}
                series={[{ data: correctRateTable.correctRate }]}
                layout="horizontal"
                {...correctRateSetting}
              />
              {ansTime.length !== 0 &&
                (<>
                  <ChartTitle>Average Respond Time (s)</ChartTitle>
                  <PieChart
                    series={[
                      {
                        data: ansTime,
                      },
                    ]}
                    width={200}
                    height={200}
                  />
                </>)
              }
            </div>
          </div>
        )}

        {/* No Player Results */}
        {gameState === -3 && (
          <div className="flex place-content-center">
            <p className="font-bold italic mt-3">
              No Player Answerred!
            </p>
          </div>
        )}
      </div>
    </>

  )
}