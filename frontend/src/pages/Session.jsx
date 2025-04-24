import { useLocation, useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar";
import { checkSessionState, endSession } from "../utils/session";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/Sessions";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";
import { QuestionDisplay } from "../components/EditQuestionCard";
import { queryQuestions } from "../utils/query";

export default function Session() {
  const {activeSessions, setActiveSessions} = useContext(SessionContext);
  const { sessionId } = useParams();
  const [active, setActive] = useState(false);
  const {state} = useLocation();  // keys: title, gameId, questions
  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState();
  const [position, setPosition] = useState(-1);  // -1: not start yet
  const [question, setQuestion] = useState({}); 
  const [nofQuestion, setNofQuestion] = useState(0); 
  const [showResult, setShowResult] = useState(false); 
  const [resResults, setResResults] = useState(''); 
  const [ansResults, setAnsResults] = useState([]); 
  const navigate = useNavigate();

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
   * Given response from 
   * 
   * @param {*} resResults 
   */
  const genAnswerResult = async (resResults) => {
    const questions = await queryQuestions(gameId);
    console.log('genAnswerResult----------')
    console.log('questions:', questions);
    console.log('resResults', resResults);
    console.log(nofQuestion);
    const ansResults = [];  
    /**
     * Three dimesion: question, player, [correct, time]
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
     */
    for (let i=0; i<nofQuestion; i++){  // question
      const qArr = [];
      const points = questions[i].points;
      const questionText = questions[i].questionText;
      for (let j=0; j<resResults.length; j++) {  // player
        const p = resResults[j];
        const correct = p.answers[i].correct;
        const time = new Date(p.answers[i].answeredAt) - new Date(p.answers[i].questionStartedAt);
        const playerName = p.name;
        qArr.push({correct, time, points, playerName, questionText});
      }
      ansResults.push(qArr);
    }
    console.log('ansResults:', ansResults);
    return ansResults;
  }
  
  const loadResult = async () => {
    // console.log('loadResult()')
    const res = await apiCall(`/admin/session/${sessionId}/results`, 'GET'); //{results: Array(0)}
    const resResults = res.results;
    setResResults(resResults);

    // generate customize answering results
    const ansResults = await genAnswerResult(resResults);
    setAnsResults(ansResults);
  }

  const getStatus = async () => {
    const res = await apiCall(`/admin/session/${sessionId}/status`, 'GET')
    const results = res.results;
    setNofQuestion(results.questions.length);
    const position = results.position;
    const question = results.questions[position]??{};
    if (Object.keys(question).length === 0) {
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
        {(-1 < position && position < nofQuestion) && `${position+1} out of ${nofQuestion}`}
        {position === nofQuestion && 'Finished'}
      </p>

      <div className="border">
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

        {showResult && (
          <p>results: {JSON.stringify(resResults)}</p>
        )}
      </div>
    </>
    
  )
}