import { deepcopy } from "./deepcopy";
import { queryGames } from "./query";
import { apiCall } from "./api";

/**
 *  Add game to games.
 *  If games contain the game, update with new one (del -> add).
 *  If not, add game.
 * 
 */
export async function addGame(game, games) {
  try {
    if (!games) {
      games = await queryGames();
    }
    const restGames = games.filter((g) => g.id != game.id);
    const updatedGames = [...restGames, game];
    // debugger
    await apiCall('/admin/games', 'PUT', { games: updatedGames });
    // setGames(games);
    // setGame(game);
  } catch (err) {
    console.error('addGame error:', err);
  }
}

/**
 *  Update questions of game.
 *  If the game contain that quesiton, update with new one (del -> add).
 *  If not, add question.
 * 
 */
export async function updateQuestions(questions, game) {
  try {
    const newGame = deepcopy(game);
    newGame.questions = questions;
    await addGame(newGame);
    return newGame;
  } catch (err) {
    console.error('updateQuestions error:' + err);
  }
}