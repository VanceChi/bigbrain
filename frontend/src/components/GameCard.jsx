import { Link } from 'react-router-dom';

export default function GameCard() {
  const [ id, title, numQuestions, thumbnail, totalDuration ] = ['4234', 'Game1', '5 questions', undefined, '1 hour'];

  return (
    <div className="p-4 bg-white rounded shadow-md flex items-center space-x-4">
      <img src={thumbnail} alt={`${title} thumbnail`} className="w-16 h-16 rounded" />
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600">{numQuestions} questions</p>
        <p className="text-sm text-gray-600">Duration: {totalDuration} seconds</p>
      </div>
      <div>
        {console.log(id)}
        <Link to={`/game/:${id}`}>EditBtn</Link><br />
      </div>
    </div>
  );
}