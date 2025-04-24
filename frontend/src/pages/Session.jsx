import { useLocation, useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar";
import { checkSessionState, endSession } from "../utils/session";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/Sessions";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";
import { QuestionDisplay } from "../components/EditQuestionCard";
import { queryQuestions } from "../utils/query";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';



export default function Session() {
  const {activeSessions, setActiveSessions} = useContext(SessionContext);
  const { sessionId } = useParams();
  const [active, setActive] = useState(false);
  const {state} = useLocation();  // keys: title, gameId, questions
  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState();
  const [position, setPosition] = useState(-1);  
  // -1: not start yet
  const [question, setQuestion] = useState({}); 
  const [nofQuestions, setNofQuestions] = useState(0); 
  const [nOfPlayers, setNOfPlayers] = useState(0); 
  const [showResult, setShowResult] = useState(false); 
  const [resResults, setResResults] = useState(''); 
  const [ansResults, setAnsResults] = useState([]); 
  const [scoreTable, setScoreTable] = useState([]); 
  const [correctRateTable, setCorrectRateTable] = useState([]); 
  const [ansTime, setAnsTime] = useState([]); 
  const navigate = useNavigate();
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
      // set session active or not
      const isActive = await checkSessionState(sessionId);
      setActive(isActive);

      // set gameId
      setGameId(state.gameId);

      // set title
      setTitle(state.title);

    }
    init();
  }, [])

  // Since cant restart session. The effect here means active -> unactive
  // Shows result.
  useEffect(() => {
    getStatus();
  }, [active])

  useEffect(() => {
    if (showResult){
      loadResult();
    }
  }, [showResult])

  /**
   * Generate ansResults, scoreTable, correctRate.
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
   * @param {*} resResults 
   */
  const genAnswerResult = async (resResults) => {
    const questions = await queryQuestions(gameId);
    const ansResults = [];  
    const nOfPlayers = resResults.length;
    for (let i=0; i<nofQuestions; i++){  // question
      const qArr = [];
      const points = questions[i].points;
      const questionText = questions[i].questionText;
      for (let j=0; j<nOfPlayers; j++) {  // player
        const p = resResults[j];
        const correct = p.answers[i].correct;
        const time = new Date(p.answers[i].answeredAt) - new Date(p.answers[i].questionStartedAt);
        const playerName = p.name;
        qArr.push({correct, time, points, playerName, questionText});
      }
      ansResults.push(qArr);
    }
    setNOfPlayers(nOfPlayers);
    setAnsResults(ansResults);

    // calculate scoreTable
    let scoreTable=[];  // [[name, score], ...]
    const scoreArr = [];  // index: player
    const playerName = [];  // index: player
    for (let p=0; p<nOfPlayers; p++){
      let score = 0;
      for (let q=0; q<nofQuestions; q++){
        score += ansResults[q][p].points*ansResults[q][p].correct;
      }
      scoreTable.push([ansResults[0][p].playerName, score]);
    }
    
    scoreTable.sort((s1, s2) => s2[1]-s1[1]);
    console.log(scoreTable)
    setScoreTable(scoreTable);

    // correct rate
    const correctRate = []; // index: question
    const questionsText = []; // index: question
    for (let q=0; q<nofQuestions; q++){
      let correctN = 0;
      questionsText.push(ansResults[q][0].questionText);
      for (let p=0; p<nOfPlayers; p++){
        correctN += ansResults[q][p].correct;
      }
      correctRate.push(correctN/nOfPlayers);
    }
    setCorrectRateTable({correctRate, questionsText});

    // respond time
    for (let q=0; q<nofQuestions; q++){
      let respondTime = 0;
      for (let p=0; p<nOfPlayers; p++){
        respondTime += ansResults[q][p].time;
      }
      respondTime /= 100*nOfPlayers;
      respondTime = Math.round(respondTime)/10;
      
      ansTime.push({value:respondTime, label: ansResults[q][0].questionText})
    }

    setAnsTime(ansTime);

    return ansResults;
  }
  
  const loadResult = async () => {
    // console.log('loadResult()')
    const res = await apiCall(`/admin/session/${sessionId}/results`, 'GET'); //{results: Array(0)}
    const resResults = res.results;
    setResResults(resResults);
    setPosition(nofQuestions);
    // generate customize answering results
    await genAnswerResult(resResults);
  }

  const getStatus = async () => {
    const res = await apiCall(`/admin/session/${sessionId}/status`, 'GET')
    const results = res.results;
    setNofQuestions(results.questions.length);
    const position = results.position;
    const question = results.questions[position]??{};
    if (Object.keys(question).length === 0 && position != -1) {
      setShowResult(true);
    } else {
      setShowResult(false);
      setPosition(position);
      setQuestion(question);
    }
  }
  
  const handleEndSession = async () => {
    try {
      const res = await endSession(undefined, sessionId, activeSessions, setActiveSessions);
      console.log('Endsession res:', res);
      setActive(false);
      setShowResult(true);
    } catch (error) {
      console.log(error);
    }
    
  }

  const hanleAdvanceQuestion = async () => {
    const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', { "mutationType": "ADVANCE" });
    getStatus();
  }

  return (
    <>
      <Navbar />
      <BackButton onClick={() => navigate('/dashboard')}/>
      {active? (
        <>
          <p>Session active</p>
          <button onClick={handleEndSession} className="border">End Session</button>
        </>
      ) : (
        <p>Session inactive</p>
      )}
      <p>Session of {title} -- session id: {sessionId}</p>
      <button className="border inline-block" onClick={hanleAdvanceQuestion}>Advance Question</button> &nbsp;&nbsp;&nbsp;
      <p className="inline-block">
        {position === -1 && 'not start'}
        {(-1 < position && position < nofQuestions) && `${position+1} out of ${nofQuestions}`}
        {position === nofQuestions && 'Finished'}
      </p>

      <div>
        {Object.keys(question).length !== 0 && !showResult && (
          <QuestionDisplay 
            questionType={question.questionType}
            questionText={question.questionText}
            duration={question.duration}
            points={question.points}
            mediaUrl={question.mediaUrl}
            answers={question.answers}
            selectedAnswers={[]}
            setSubmitted={() => console.log('Finished.')}
            setSelectedAnswers={()=>console.log('You can not answer here.')}
            setResult={()=>console.log('setResult.')}
            mode={'observe'}
          />
        )} 

        {showResult && Object.keys(correctRateTable).length !==0 && (
          <div>
            <div aria-label="score-container">
            <p>Score Table</p>
            <table className="table-auto">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {scoreTable.slice(0, 5).map((score, index) => (
                  <tr key={index}>
                    <td className="border">{score[0]}</td>
                    <td className="border">{score[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            </div>
            <div className="mt-6">
              <p>Correct Rate</p>
              <BarChart
                yAxis={[
                  {
                    id: 'Correct Rate',
                    data: correctRateTable.questionsText,
                    scaleType: 'band',
                  },
                ]}
                series={[{data: correctRateTable.correctRate}]}
                layout="horizontal"
                {...correctRateSetting}
              />
              {ansTime.length !==0 && 
               (<>
                  <p>Average Respond Time (s)</p>
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
      </div>
    </>
    
  )
}