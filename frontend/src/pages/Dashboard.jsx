// Dashboard.jsx
import { useEffect, useState } from "react";
import { apiCall } from "../utils/api"
import GameCard from "../components/GameCard"
import { queryGames } from "../utils/query";
import { genId } from "../utils/genId";

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [newGameName, setNewGameName] = useState('');
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [ownerEmail] = useState(JSON.parse(localStorage.getItem('email')));

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    try {
      const games = await queryGames();
      setGames(games);
    } catch (err) {
      console.error(err);
    }
  }


  const updateGames = () => {
    const games = [...games, { id: genId(), name: newGameName, owner: ownerEmail }];
    setGames(games)
    apiCall('/admin/games', 'PUT', { games });
    setShowCreateGame(false);
  }

  const handleAddGame = () => {
    setShowCreateGame(showCreateGame => !showCreateGame)
  }

  return (
    <>
      <div>
        <div className={`flex gap-4 p-4 `}>
          <div className={`flex p-2 w-full ${showCreateGame && 'bg-bigbrain-milky-canvas/80 rounded-2xl place-items-center'}`}>
            <button
              className="m-2 bg-bigbrain-light-pink font-bold text-sm/4 text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3 mb-2 w-40 rounded-3xl"
              onClick={() => handleAddGame()}
              title="Click to Add Game"
            >+ Game
            </button>
            {showCreateGame && (
              <div aria-label="add-game-container" className="flex gap-1 w-[170%]">
                <input
                  id="name"
                  type="text"
                  value={newGameName}
                  style={{ display: showCreateGame }}
                  onChange={e => setNewGameName(e.target.value)}
                  placeholder="Set Name"
                  className="p-2 border-2 rounded border-bigbrain-light-pink  w-[200%]"
                  autoComplete="off"
                />
                <button 
                  onClick={updateGames} 
                  className="bg-bigbrain-light-pink p-2 text-white rounded-2xl hover:bg-bigbrain-dark-pink hover:cursor-pointer inline-block"
                >
                  Sumbit
                </button>
              </div>
            )}
          </div>
        </div>
        <div aria-label="game-display" className="m-3 sm:grid sm:grid-cols-1 sm:gap-2 md:grid md:grid-cols-2 md:gap-4 ">
          {games.map((game, index) => (
            <div key={index}>
              <GameCard
                gameId={game.id}
                title={game.title || game.name}
                numQuestions={game.questions?.length || 0}
                thumbnail={game.thumbnail}
                totalDuration={game.questions?.reduce((sum, q) => sum + (q.duration || 0), 0) || 0}
                questions={game.questions}
              />
              <br />
            </div>
          ))}
        </div>
      </div>
    </>

  )
}