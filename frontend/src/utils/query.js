import { apiCall } from "./api";

/**
 * Get all games in an array.
 * 
 * @returns {Array} Array of all games.
 */
export async function queryGames() {
  try {
    const { games } = await apiCall('/admin/games', 'GET');
    return games;
  } catch(error) {
    throw new Error(error);
  }
}

/**
 * Get game by gameId.
 * 
 * @param {String | Number} gameId The game must be created by the admin.
 * @param {Array | undefined} games 
 * @returns {Object | undefined} one game object.
 */
export async function queryGamebyId(gameId, games) {
  try {
    if(games === undefined){
      games = await queryGames();
    }
    return games.find((game) => game.id == gameId);
  } catch(error) {
    throw new Error(error);
  }
}

/**
 * Query active session id of game.
 * 
 * @param {String|Number} gameId 
 * @returns {String|undefined} 
 */
export function querySessionId(gameId) {
  if(gameId===undefined){
    throw Error('gameId undefined.');
  }
  const activeSessions = JSON.parse(localStorage.getItem('activeSessions'));
  if (!activeSessions) return '';
  
  const session = activeSessions.find(session => session.gameId == gameId);
  return session?.activeSessionId;
}

/**
 * Query gameId of active session.
 * 
 * @param {String|Number} gameId 
 * @returns {String|undefined} 
 */
export function queryGameId (sessionId) {
  const activeSessions = JSON.parse(localStorage.getItem('activeSessions'));
  const session = activeSessions.find(session => session.activeSessionId == sessionId);
  if (session === undefined) return undefined;
  else {
    const gameId = session.gameId;
    return gameId;
  }
}

export async function queryGamebySessionId(sessionId) {
  const gameId = await queryGameId(sessionId);
  return await queryGamebyId(gameId);
}

/**
 * Get the questions by gameId.
 * 
 * @param {String | Number} gameId 
 * @param {Object | undefined} game 
 * @param {Array | undefined} games 
 * @returns {Arrary} All questions of that game. [] if null
 */
export async function queryQuestions(gameId, game, games) {
  try {
    if (game === undefined){
      game = await queryGamebyId(gameId, games);
    }
    const questions = game.questions;
    return questions ?? [];
  } catch(error) {
    console.log(error);
  }
}

/**
 * Get the question by gameId and questionId.
 * 
 * @param {String|Number} gameId 
 * @param {String|Number} questionId 
 * @param {Array|undefined} questions 
 * @param {Object|undefined} game 
 * @param {Array} games 
 * @returns {Object|undefined} one certain question of that game.
 */
export async function queryQuestion(gameId, questionId, questions, game, games) {
  try {
    if (questions === undefined){
      questions = await queryQuestions(gameId, game, games);
    }
    
    const question = questions.find((question) => question.id == questionId);
    return question;
  } catch(error) {
    throw new Error(error);
  }
}