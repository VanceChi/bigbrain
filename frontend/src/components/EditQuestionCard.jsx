import { useState, useEffect } from "react";
import { genQuesID } from "../utils/genId";
import { queryGames, queryGamebyId, queryQuestion, queryQuestions } from "../utils/query";
import { deepcopy } from "../utils/deepcopy";
import { apiCall } from '../utils/api';

const QuestionEditor = ({
  questionType, setQuestionType,
  questionText, setQuestionText,
  timeLimit, setTimeLimit,
  points, setPoints,
  mediaUrl, setMediaUrl,
  answers, setAnswers,
  saveQuestion
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
    const id = genQuesID();
    try {
      saveQuestion({
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
          onClick={handleSaveQuestion}
          className="bg-bigbrain-dark-pink text-white px-4 py-2 rounded mt-2  hover:cursor-pointer ml-1"
        > 
          Save Question
        </button>
      </div>
    </div>
  );
};

export const QuestionDisplay = ({
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
            setResult('Time\'s up!');
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
        Reset Answering
      </button>
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
  // const [question, setQuestion] = useState(null);
  const [questionType, setQuestionType] = useState('single');
  const [questionText, setQuestionText] = useState('');
  const [timeLimit, setTimeLimit] = useState();
  const [points, setPoints] = useState();
  const [mediaUrl, setMediaUrl] = useState('');
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [result, setResult] = useState('');

  useEffect(() => {
    async function loadQuestion() {
      console.log('loadQuestion')
      const q = await queryQuestion(gameId, questionId);
      setQuestionType(q.questionType);
      setQuestionText(q.questionText);
      setTimeLimit(q.timeLimit);
      setPoints(q.points);
      setMediaUrl(q.mediaUrl);
      setAnswers(q.answers);
      setSelectedAnswers(q.answers.filter((answer)=>answer.correct===true));
      setSubmitted(false);
      setTimeLeft(q.timeLimit);
      setResult('');
    }
    function resetEditor() {
      console.log('resetEditor')
      setQuestionText('What is the capital of Australia?');
      setAnswers([
        { text: 'Canberra', correct: true },
        { text: 'London', correct: false },
        { text: 'Berlin', correct: false },
      ]);
      setTimeLimit(30);
      setPoints(100);
    }
    async function initEditor(gameId, questionId) {
      const games = await queryGames();
      const game = await queryGamebyId(gameId, games);
      questions = await queryQuestions(gameId, game);
      setGames(games);
      setGame(game);
      
      if (showAddQues === undefined) {
        showAddQues = true;
      }

      if (questionId)
        loadQuestion();
      else {
        resetEditor();
      }
    }
    
    initEditor(gameId, questionId);
    
  }, []);
