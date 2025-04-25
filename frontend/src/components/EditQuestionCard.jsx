import { useState, useEffect } from "react";
import { genId } from "../utils/genId";
import { queryGames, queryGamebyId, queryQuestion, queryQuestions } from "../utils/query";
import { deepcopy } from "../utils/deepcopy";
import { apiCall } from '../utils/api';

const QuestionEditor = ({
  questionType, setQuestionType,
  questionText, setQuestionText,
  duration, setDuration,
  points, setPoints,
  mediaUrl, setMediaUrl,
  answers, setAnswers,
  saveQuestion,
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

  const handleSaveQuestion = () => {
    // detect inputs value null, prompt
    if (!questionText || !answers) {
      alert('please Enter all.');
      return;
    }
    const id = genId();
    try {
      const correctAnswers = answers.filter(a=>a.correct===true).map(a=>a.text);
      saveQuestion({
        id,
        questionType,
        questionText,
        points,
        mediaUrl,
        answers,
        duration,
        correctAnswers
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
            value={duration}
            onChange={(e) => {setDuration(Number(e.target.value))}}
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
          onClick={handleSaveQuestion}
          className="bg-bigbrain-dark-pink text-white px-4 py-2 rounded mt-2  hover:cursor-pointer ml-1"
        > 
          Save Question
        </button>
      </div>
    </div>
  );
};

/**
 * Answering display. Consist of three modes.
 * 
 * @param {String} mode 'preview' 'observe' 'answer'
 * preview: Show everything.w
 * observe: Hide submit answer && reset answer
 * answer: Hide reset answer
 * @returns 
 */
export const QuestionDisplay = ({
  questionType, questionText, duration, points, mediaUrl, answers,
  selectedAnswers, setSelectedAnswers, 
  submitted, setSubmitted,
  result, setResult,
  mode
}) => {
  // set time limit
  const [timeLeft, setTimeLeft] = useState(duration);
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration])

  useEffect(() => {
    if (!submitted && timeLeft > 0) {  // able to answer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {  // times up
            clearInterval(timer);
            setSubmitted(true);
            setResult('Time\'s up!');
            return 0;
          } 

          return prev - 1;  // count down
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [submitted]);

  /**
   * 
   * @param {Object} answer { "text": "Ottawa",
                              "correct": true }
   */
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

  const isYouTubeUrl = mediaUrl && mediaUrl?.includes('youtube.com') || mediaUrl?.includes('youtu.be');
  const youtubeEmbedUrl = isYouTubeUrl
    ? mediaUrl.replace('watch?v=', 'embed/').replace(/youtu.be\//, 'youtube.com/embed/')
    : null;

  
  const handleReset = () => {
    setSelectedAnswers([]);
    setSubmitted(false);
    setTimeLeft(duration);
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
      <p className="mb-2 font-bold">Time Left: {timeLeft}s | Points: {points}</p>
      {answers?.map((answer, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type={questionType === 'multiple' ? 'checkbox' : 'radio'}
            checked={selectedAnswers.map(a=>a.text).includes(answer.text)}
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
      {mode!=='observe' && (<button
        onClick={handleSubmit}
        disabled={submitted || selectedAnswers?.length === 0}
        className="bg-bigbrain-dark-pink text-white px-4 py-2 rounded disabled:bg-bigbrain-light-pink mt-4 hover:cursor-pointer"
      >
        Submit Answer
      </button>)}
      
      {mode==='preview' && (<button
        onClick={handleReset}
        className="bg-gray-500 text-white px-4 py-2 rounded ml-1"
      >
        Reset Answering
      </button>)}
      {submitted && <p className="mt-4 text-lg">{result}</p>}
    </div>
  );
};

/**
 * Show editor. Edit certain question. Save it to backend.
 * 
 * @param {*} questionId if quesitonId: undefined. Generate new question.
 * @param {*} gameId
 * @returns 
 */
export default function EditQuestionCard({gameId, questionId, showAddQues, setShowAddQues, questions, setQuestions}) {
  const [games, setGames] = useState([]);
  const [game, setGame] = useState({});
  const [questionType, setQuestionType] = useState('single');
  const [questionText, setQuestionText] = useState('');
  const [duration, setDuration] = useState(30);
  const [points, setPoints] = useState(100);
  const [mediaUrl, setMediaUrl] = useState('');
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  
  // initEditor for Edit question / New question
  useEffect(() => {
    async function loadQuestion() {
      const q = await queryQuestion(gameId, questionId);
      setQuestionType(q.questionType);
      setQuestionText(q.questionText);
      setDuration(q.duration);
      setPoints(q.points);
      setMediaUrl(q.mediaUrl);
      setAnswers(q.answers);
      setSelectedAnswers(q.answers.filter((answer)=>answer.correct===true));
      setSubmitted(false);
      setResult('');
    }
    function resetEditor() {
      setQuestionText('What is the capital of Australia?');
      setAnswers([
        { text: 'Canberra', correct: true },
        { text: 'London', correct: false },
        { text: 'Berlin', correct: false },
      ]);
    }

    async function initEditor(gameId, questionId) {
      const games = await queryGames();
      const game = await queryGamebyId(gameId, games);
      questions = await queryQuestions(gameId, game);
      setGames(games);
      setGame(game);
      if (showAddQues === undefined)
        showAddQues = true;

      if (questionId) 
        loadQuestion();
      else 
        resetEditor();
    }
    
    initEditor(gameId, questionId);
  }, []);

  // Reset answers and time when question type changes
  useEffect(() => {
    if (questionType === 'judgment') {
      setAnswers([
        { text: 'True', correct: true },
        { text: 'False', correct: false }
      ]);
    } else {
      setAnswers([
        { text: '', correct: true },
        { text: '', correct: false },
      ]);
    }
    setSelectedAnswers([]);
    setSubmitted(false);
    setResult('');
  }, [questionType]);
  

  /**
   *  Given game, questions from Closure (EditQuizQuestionCard) 
   *  If the game contain that quesiton, update with new one (del -> add).
   *  If not, add question.
   * 
   * @param {Object {}} question { id:... , ... }
   */
  const saveQuestion = async (question) => {
    // input check
    if ((typeof question !== 'object') || question.id === undefined) {
      console.error('quesiton added unvalid.');
      return;
    }
    try {
      let newQuestions = [];
      if(questionId === undefined){  
        
        // Add question
        newQuestions = [...questions, question];
      } else {  

        // Update question
        const restQues = questions.filter(q => q.id != questionId);
        question.id = questionId;
        newQuestions = [...restQues, question];
      }
      await updateQuestions(newQuestions);
      if(questionId === undefined) setShowAddQues(false);
    } catch (err) {
      console.error('saveQuestion error:' + err);
    }
  };

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
      console.error('updateQuestions error:' + err);
    }
  }

  /**
   *  Add game to games. Given games, from Closure (EditQuizQuestionCard) 
   *  If games contain the game, update with new one (del -> add).
   *  If not, add game.
   * 
   */
  const addGame = async (game) => {
    try {
      const restGames = games.filter((g) => g.id != game.id);
      const updatedGames = [...restGames, game];
      await apiCall('/admin/games', 'PUT', {games: updatedGames});
      console.log('Question saved.')
      setGames(games);
      setGame(game);
    } catch (err) {
      console.error('addGame error:', err);
    }
  }

  return (
    <>
      {showAddQues && (
        <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Game Question Editor</h1>
        <QuestionEditor
          questionType={questionType} setQuestionType={setQuestionType}
          questionText={questionText} setQuestionText={setQuestionText}
          duration={duration} setDuration={setDuration}
          points={points} setPoints={setPoints}
          mediaUrl={mediaUrl} setMediaUrl={setMediaUrl}
          answers={answers} setAnswers={setAnswers}
          saveQuestion={saveQuestion}
        />
        <h2 className="text-xl font-bold mb-4">Question Display</h2>
        <QuestionDisplay
          questionType={questionType}
          questionText={questionText}
          duration={duration}
          points={points}
          mediaUrl={mediaUrl}
          answers={answers}
          selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers}
          submitted={submitted} setSubmitted={setSubmitted}
          result={result} setResult={setResult}
          mode={'preview'}
        />
        </div>
      )}
    </>
  );
};
