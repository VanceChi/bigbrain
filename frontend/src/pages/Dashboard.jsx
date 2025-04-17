import { useEffect, useState } from "react";
import { apiCall } from "../utils/api"
import GameCard from "../components/GameCard"
import Navbar from "../components/Navbar";

const createGame = () => {
  const body = {
                "games": [
                  {
                    "name": "My first game",
                    "owner": "hayden@unsw.edu.au",
                    "questions": [
                      {}
                    ]
                  },
                  
                  {
                    "name": "My second game",
                    "owner": "hayden@unsw.edu.au",
                    "questions": [
                      {}
                    ]
                  },
                  
                  {
                    "name": "My second game",
                    "owner": "hayden@unsw.edu.au",
                    "questions": [
                      {}
                    ]
                  },
                  
                  {
                    "name": "My second game",
                    "owner": "hayden@unsw.edu.au",
                    "questions": [
                      {}
                    ]
                  },
                  
                  {
                    "name": "My second game",
                    "owner": "hayden@unsw.edu.au",
                    "questions": [
                      {}
                    ]
                  }
                ]
              };

  apiCall('/admin/games', 'PUT', body);
}

export default function Dashboard() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiCall('/admin/games', 'GET');
        setGames(res.games);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);




  return (
    <div>
      <Navbar dashboardBtnShow='true' editGameBtnShow='true' />
      <button 
        className=" bg-bigbrain-light-pink font-bold text-sm/4 text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3 mb-2 rounded-3xl" 
        onClick={createGame}
      >+ Game
      </button>
      <div className="m-3">
        {games.map((game, index) => {
          return(
            <div key={index}>
              <GameCard 
                id={game.id}
                title={game.title || game.name}
                numQuestions={game.questions?.length || 0}
                thumbnail={game.thumbnail}
                totalDuration={game.questions?.reduce((sum, q) => sum + (q.duration || 0), 0) || 0}
              />
              <br />
            </div>
          )
        })}
      </div>
    </div>
    
  )
}