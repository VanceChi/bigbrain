import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/api';
import Navbar from '../components/Navbar';


const QuestionEditor = ({
  questionType, setQuestionType,
  questionText, setQuestionText,
  timeLimit, setTimeLimit,
  points, setPoints,
  mediaUrl, setMediaUrl,
  answers, setAnswers,
}) => {
  const addAnswer = () => {
    if (answers.length < 6) {
      setAnswers([...answers, { text: '', correct: false }]);
    }
  };

  const updateAnswer = (index, text) => {
    const newAnswers = [...answers];
    newAnswers[index].text = text;
    setAnswers(newAnswers);
  };

  const toggleCorrect = (index) => {
    const newAnswers = [...answers];
    if (questionType === 'single' || questionType === 'judgment') {
      newAnswers.forEach((ans, i) => (ans.correct = i === index));
    } else {
      newAnswers[index].correct = !newAnswers[index].correct;
    }
    setAnswers(newAnswers);
  };

  const removeAnswer = (index) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="mb-4">
      {console.log('a')}
      <div className="mb-4">
        <label className="block mb-1">Question Type:</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
          <option value="judgment">Judgment</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Question:</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Enter question"
        />
      </div>
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block mb-1">Time Limit (seconds):</label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="p-2 border rounded w-full"
            min="1"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Points:</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="p-2 border rounded w-full"
            min="1"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Media URL (YouTube or Image):</label>
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Enter YouTube URL or image URL"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Answers (2-6):</label>
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={answer.text}
              onChange={(e) => updateAnswer(index, e.target.value)}
              className="p-2 border rounded flex-1 mr-2"
              placeholder={`Answer ${index + 1}`}
            />
            <input
              type="checkbox"
              checked={answer.correct}
              onChange={() => toggleCorrect(index)}
              className="mr-2"
              disabled={questionType === 'judgment' && answers.length === 1}
            />
            <button
              onClick={() => removeAnswer(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
              disabled={answers.length <= 2}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addAnswer}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          disabled={answers.length >= 6}
        >
          Add Answer
        </button>
      </div>
    </div>
  );
};


/**
 * 1. Allow to select the question they want to edit
 * 2. Allow to DELETE a particular question and ADD a new question, all actions must be done without a refresh.
 * 
 * @returns 
 */
export default function EditGame() {
  const location = useLocation();
  const [title, setTitle] = useState(location.state.title);
  const [questions, setQuestions] = useState(location.state.questions);
  const [showAddQues, setShowAddQues] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiCall('/admin/auth/logout', 'POST');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar dashboardBtnShow={true} rightBtn={{ name: 'Log out', handler: handleLogout }} />
      <div className="p-5 bg-bigbrain-light-mint min-h-[80vh]">
        <h2 className="text-2xl font-bold mb-4 ">Edit Game: {title}</h2>
        
        <button 
            className=" bg-bigbrain-light-pink font-bold text-sm/4 text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3 mb-2 rounded-3xl" 
            onClick={() => setShowAddQues(showAddQues => !showAddQues)}
          >+ Question
        </button>

        {/* Input question Info */}
        {console.log('1', showAddQues)}
        {showAddQues && <QuizQuestion />}
        {console.log('2',)}



        <div className="bg-bigbrain-light-mint flex justify-center h-fit">
          <div>
            {questions? questions.map(() => {

              }):(
                <p style={{display:(showAddQues?'none':'block')}}>No question</p>
              )
            }
          </div>
        </div>
        

      </div>
    </>
  );
}