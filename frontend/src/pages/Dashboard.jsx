// Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import { apiCall } from "../utils/api"
import GameCard from "../components/GameCard"
import Navbar from "../components/Navbar";
import { queryGames } from "../utils/query";
import { SessionContext } from "../context/Sessions";


export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [newGameName, setNewGameName] = useState('');
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [ownerEmail] = useState(JSON.parse(localStorage.getItem('email')) || '');
  // console.log('', useContext(SessionContext));

  useEffect(() => {
    (async () => {
      try {
        const games = await queryGames();
        setGames(games);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);


  const updateGames = () => {
    console.log('updateGames', ownerEmail)
    const newGames = [...games, {name: newGameName, owner: ownerEmail}];
    setGames(newGames)
    apiCall('/admin/games', 'PUT', {games: newGames});
  }
  
  const createGame = () => {
    setShowCreateGame(showCreateGame=>!showCreateGame)
  }

  return (
    <div>
      <Navbar />
      <div className="flex">
        <button 
          className=" bg-bigbrain-light-pink font-bold text-sm/4 text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3 mb-2 rounded-3xl" 
          onClick={() => createGame()}
        >+ Game
        </button>
        {showCreateGame && (<>
          <input
            id="name"
            type="text"
            value={newGameName}
            style={{display:showCreateGame}}
            onChange={(e) => setNewGameName(e.target.value)}
            placeholder="Set Name"
            className="block p-2 border rounded"
            autoComplete="off"
          />
          <button onClick={updateGames}>Sumbit</button>
        </>)}
      </div>
      <div className="m-3">
        {games.map((game, index) => (
          <div key={index}>
            {/* {console.log(game)} */}
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
    
  )
}