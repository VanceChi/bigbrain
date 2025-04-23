import { useLocation, useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar";
import { checkSessionState, endSession } from "../utils/session";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/Sessions";
import { BackButton } from "../components/Button";
import { apiCall } from "../utils/api";
import { QuestionDisplay } from "../components/EditQuestionCard";

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
    const loadResult = async () => {
      const res = await apiCall(`/admin/session/${sessionId}/results`, 'GET'); //{results: Array(0)}
      setResults(res.results);
      debugger
    }

    
    getStatus();
    
  }, [active])

  
  const getStatus = async () => {
    const res = await apiCall(`/admin/session/${sessionId}/status`, 'GET')
    const results = res.results;
    setNofQuestion(results.questions.length);
    const position = results.position;
    const question = results.questions[position]??{};
    setPosition(position);
    setQuestion(question);
  }
  
  const handleEndSession = async () => {
    try {
      const res = await endSession(undefined, sessionId, activeSessions, setActiveSessions);
      console.log('Endsession res:', res);
      setActive(false);
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
        <p>Session unactive</p>
      )}
      <p>Session of {title} -- session id: {sessionId}</p>
      <button className="border inline-block" onClick={hanleAdvanceQuestion}>Advance Question</button> &nbsp;&nbsp;&nbsp;
      <p className="inline-block">
        {position === -1 && 'not start'}
        {(-1 < position && position < nofQuestion) && `${position+1} out of ${nofQuestion}`}
        {position === nofQuestion && 'Finished'}
      </p>
      {/* <div className="border">
        {Object.keys(question).length !== 0 ? (
          <p>{JSON.stringify(question)}</p>
        ) : (
          <p>Not start yet</p>
        )}
      </div> */}
      <div className="border">
        {Object.keys(question).length !== 0 ? (
          <QuestionDisplay 
            questionType={question.questionType}
            questionText={question.questionText}
            timeLimit={question.timeLimit}
            points={question.points}
            mediaUrl={question.mediaUrl}
            answers={question.answers}
            selectedAnswers={[]}
            setSubmitted={() => console.log('Finished.')}
            setSelectedAnswers={()=>console.log('You can not answer here.')}
            setResult={()=>console.log('setResult.')}
            mode={'observe'}
          />
        ) : (
          <p>Not start yet</p>
        )}
      </div>
    </>
    
  )
}