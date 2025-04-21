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
    <>
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
        {/* <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <svg class="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-base font-semibold text-gray-900" id="modal-title">Deactivate account</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Deactivate</button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
              </div>
            </div>
          </div>
        </div> */}
      </div>

    </>
    
  )
}