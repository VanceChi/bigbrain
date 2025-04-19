import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { deepcopy } from '../utils/deepcopy';
import Navbar from '../components/Navbar';
import { BackButton } from "../components/Button"

const genQuesID = () => {
  const quesId = +new Date();
  return quesId;
}

const QuestionEditor = ({
  questionType, setQuestionType,
  questionText, setQuestionText,
  timeLimit, setTimeLimit,
  points, setPoints,
  mediaUrl, setMediaUrl,
  answers, setAnswers,
  addQuestion
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

  const handleAddQuestion = () => {
    const id = genQuesID();
    try {
      addQuestion({
        id,
        questionType,
        questionText,
        timeLimit,
        points,
        mediaUrl,
        answers
     })
   } catch (err) {
     console.error(err);
   }
  }


  return (
    <div className="mb-4">
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
        <label className="block mb-1">Answers (2-6) Tick correct answer:</label>
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
              className="bg-bigbrain-dark-pink text-white px-2 py-1 rounded  hover:cursor-pointer"
              disabled={answers.length <= 2}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addAnswer}
          className="bg-bigbrain-dark-pink text-white px-4 py-2 rounded mt-2  hover:cursor-pointer"
          disabled={answers.length >= 6}
        >
          Add Answer
        </button>
        <button 
          onClick={handleAddQuestion}
          className="bg-bigbrain-dark-pink text-white px-4 py-2 rounded mt-2  hover:cursor-pointer ml-1"
        > 
          Add Question
        </button>
      </div>
    </div>
  );
};

const QuestionDisplay = ({
  questionType, questionText, timeLimit, points, mediaUrl, answers,
  selectedAnswers, setSelectedAnswers, submitted, setSubmitted,
  timeLeft, setTimeLeft, result, setResult,
}) => {
  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSubmitted(true);
            setResult('Time’s up!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  const handleSelect = (answer) => {
    if (questionType === 'multiple') {
      if (selectedAnswers.includes(answer)) {
        setSelectedAnswers(selectedAnswers.filter((ans) => ans !== answer));
      } else {
        setSelectedAnswers([...selectedAnswers, answer]);
      }
    } else {
      setSelectedAnswers([answer]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correctAnswers = answers.filter((ans) => ans.correct);
    const isCorrect =
      questionType === 'multiple'
        ? selectedAnswers.length === correctAnswers.length &&
          selectedAnswers.every((ans) => ans.correct)
        : selectedAnswers.length === 1 && selectedAnswers[0].correct;

    setResult(isCorrect ? `Correct! +${points} points` : 'Incorrect.');
  };

  const isYouTubeUrl = mediaUrl && mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be');
  const youtubeEmbedUrl = isYouTubeUrl
    ? mediaUrl.replace('watch?v=', 'embed/').replace(/youtu.be\//, 'youtube.com/embed/')
    : null;

  
  const handleReset = () => {
    setSelectedAnswers([]);
    setSubmitted(false);
    setTimeLeft(timeLimit);
    setResult('');
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">{questionText}</h2>
      {mediaUrl && (
        <div className="mb-4">
          {isYouTubeUrl ? (
            <iframe
              width="100%"
              height="315"
              src={youtubeEmbedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img src={mediaUrl} alt="Question media" className="w-full h-auto rounded" />
          )}
        </div>
      )}
      <p className="mb-2">Time Left: {timeLeft}s | Points: {points}</p>
      {answers.map((answer, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type={questionType === 'multiple' ? 'checkbox' : 'radio'}
            checked={selectedAnswers.includes(answer)}
            onChange={() => handleSelect(answer)}
            disabled={submitted}
            className="mr-2"
          />
          <span>{answer.text}</span>
          {submitted && (
            <span className="ml-2">{answer.correct ? '✅' : '❌'}</span>
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={submitted || selectedAnswers.length === 0}
        className="bg-bigbrain-dark-pink text-white px-4 py-2 rounded disabled:bg-bigbrain-light-pink mt-4 hover:cursor-pointer"
      >
        Submit Answer
      </button>
      
      <button
        onClick={handleReset}
        className="bg-gray-500 text-white px-4 py-2 rounded ml-1"
      >
        Reset Answer
      </button>
      {submitted && <p className="mt-4 text-lg">{result}</p>}
    </div>
  );
};

const AddQuizQuestionCard = ({addQuestion}) => {
  const [questionType, setQuestionType] = useState('single');
  const [questionText, setQuestionText] = useState('What is the capital of Australia?');
  const [timeLimit, setTimeLimit] = useState(30);
  const [points, setPoints] = useState(100);
  const [mediaUrl, setMediaUrl] = useState('');
  const [answers, setAnswers] = useState([
    { text: 'Canberra', correct: true },
    { text: 'London', correct: false },
    { text: 'Berlin', correct: false },
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [result, setResult] = useState('');

  // Reset answers and time when question type changes
  useEffect(() => {
    if (questionType === 'judgment') {
      setAnswers([{ text: 'True', correct: true }]);
    } else {
      setAnswers([
        { text: '', correct: true },
        { text: '', correct: false },
      ]);
    }
    setSelectedAnswers([]);
    setSubmitted(false);
    setTimeLeft(timeLimit);
    setResult('');
  }, [questionType, timeLimit]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Game Question Editor</h1>
      <QuestionEditor
        questionType={questionType}
        setQuestionType={setQuestionType}
        questionText={questionText}
        setQuestionText={setQuestionText}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        points={points}
        setPoints={setPoints}
        mediaUrl={mediaUrl}
        setMediaUrl={setMediaUrl}
        answers={answers}
        setAnswers={setAnswers}
        addQuestion={addQuestion}
      />
      <h2 className="text-xl font-bold mb-4">Question Preview</h2>
      <QuestionDisplay
        questionType={questionType}
        questionText={questionText}
        timeLimit={timeLimit}
        points={points}
        mediaUrl={mediaUrl}
        answers={answers}
        selectedAnswers={selectedAnswers}
        setSelectedAnswers={setSelectedAnswers}
        submitted={submitted}
        setSubmitted={setSubmitted}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        result={result}
        setResult={setResult}
      />
    </div>
  );
};

/**
 * 1. Allow to select the question they want to edit
 * 2. Allow to ADD a new question
 * 3. Allow to DELETE a particular question
 * 
 * @returns UI of editting a single game.
 */
export default function EditGame() {
  // pass down games, game, questions to children componet 
  const location = useLocation();
  const param = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showAddQues, setShowAddQues] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiCall('/admin/games', 'GET');
        const games = res.games;
        setGames(games);
        const gameId = param.gameId;
        const game = games.filter((game) => game.id == gameId)[0];
        setGame(game);
        setTitle(game.name);
        setQuestions(game.questions??[]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [])


  /**
   *  Add game to games. Given games, from Closure (EditGame) 
   *  If games contain the game, update with new one (del -> add).
   *  If not, add game.
   * 
   */
  const addGame = async (game) => {
    try {
      const restGames = games.filter((g) => g.id != game.id);
      const updatedGames = [...restGames, game];
      await apiCall('/admin/games', 'PUT', {games: updatedGames});
      setGames(games);
      setGame(game);
    } catch (err) {
      console.err('addGame error:', err);
    }
  }
  /**
   *  Update questions of game. Given game, from Closure (EditGame) 
   * 
   */
  const updateQuestions = async (questions) => {
    try {
      const newGame = deepcopy(game);
      newGame.questions = questions;

      await addGame(newGame);
      setQuestions(questions);
    } catch (err) {
      console.err('updateQuestions error:' + err);
    }
  }

  /**
   *  Given game from Closure (EditGame) 
   *  If the game contain that quesiton, update with new one (del -> add).
   *  If not, add question.
   * 
   * @param {Object {}} question { id:... , ... }
   */
  const addQuestion = async (question) => {
    // input check
    if ((typeof question !== 'object') || question.id === undefined) {
      console.error('quesiton added unvalid.');
      return;
    }

    try {
      const newQuestions = [...questions, question];
      await updateQuestions(newQuestions);
      setShowAddQues(false);
    } catch (err) {
      console.error('addQuestion error:' + err);
    }
  };

  const delQuesHandler = async (id) => {
    try {
      const newQuestions = questions.filter(question => question.id != id);
      await updateQuestions(newQuestions);
    } catch (err) {
      console.error('delQuestion error:' +  err)
    }
    
  }

  const editQuesHandler = (quesId) => {
    navigate(`/game/${game.id}/question/${quesId}`);
  }

  return (
    <>
      <Navbar  />
      <BackButton />
      <div className="p-5 bg-bigbrain-light-mint min-h-[80vh]">
        <h2 className="text-2xl font-bold mb-4 ">Edit Game: {title}</h2>
        
        <button 
            className=" bg-bigbrain-light-pink font-bold text-sm/4 text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3 mb-2 rounded-3xl" 
            onClick={() => setShowAddQues(showAddQues => !showAddQues)}
          >+ Question
        </button>

        {/* Input question Info */}
        {showAddQues && 
        <AddQuizQuestionCard 
          addQuestion={addQuestion}
        />}

        {/* All questions now */}
        <div className="bg-bigbrain-light-mint justify-center h-fit">
          <h2>Questions:</h2>
          {Array.isArray(questions)? questions.map((question) => {
            return (
              <div key={question.id} className='border m-1'>
                <div>
                  <p>{JSON.stringify(question.questionText)}</p>
                </div>
                <div className='flex place-content-between'>
                  <button 
                    className='border w-1/2'
                    onClick={() => delQuesHandler(question.id)}
                  >Delete</button>
                  <button 
                    className='border w-1/2'
                    onClick={() => editQuesHandler(question.id)}
                  >Edit</button>
                </div>
              </div>
            )
          }):(
            <p style={{display:(showAddQues?'none':'block')}}>No question</p>
          )
          }
        </div>
        

      </div>
    </>
  );
}