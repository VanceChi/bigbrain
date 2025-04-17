import { Link } from 'react-router-dom';

export default function GameCard({id, title, numQuestions, thumbnail, totalDuration}) {
            // ['4234', 'Game1', '5 questions', undefined, '1 hour'];
  return (
    <div className="p-2 bg-white rounded-2xl shadow-md items-center space-x-4">
      <div className='flex items-center'>
        <p>Active?</p> &nbsp;&nbsp;&nbsp;
        <p className='text-sm'>Copy Link</p>
      </div>
      <h4 className="text-lg font-bold">{title}</h4>
      <div className='p-2 bg-white flex items-center space-x-4 text-sm'>
        <img src={thumbnail} alt={`${title} thumbnail`} className="w-16 h-16 rounded" />
        <div>
          <p className="text-sm text-gray-600">{numQuestions} questions</p>
          <p className="text-sm text-gray-600">Duration: {totalDuration} seconds</p>
        </div>
        <div>
          <Link 
            to={`/game/${id}`}
            state={{id, title}}
            >Edit Game
          </Link>
          <br />
          <button>Start Game</button>
        </div>
      </div>
    </div>
  );
}