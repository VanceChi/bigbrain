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
