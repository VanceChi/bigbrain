import { apiCall } from "../utils/api";

/**
 * Get all games in an array.
 * 
 * @returns {Array} Array of all games.
 */
export async function queryGames() {
  try {
    const res = await apiCall('/admin/games', 'GET');
    const games = res.games;
    return games;
  } catch(error) {
    throw new Error(error);
  }
}

/**
 * Get game by gameId.
 * 
 * @param {String | Number} gameId The game must be created by the admin.
 * @returns {Object | undefined} one game object.
 */
export async function queryGame(gameId) {
  try {
    const games = await queryGames();
    const game = games.filter((game) => game.id == gameId)[0];
    return game;
  } catch(error) {
    throw new Error(error);
  }
}

/**
 * Get the questions by gameId.
 * 
 * @param {String | Number} gameId 
 * @returns {Arrary} All questions of that game.
 */
export async function queryQuestions(gameId) {
  try {
    const game = await queryGame(gameId);
    const questions = game.questions;
    return questions ?? [];
  } catch(error) {
    throw new Error(error);
  }
}

/**
 * Get the question by gameId and questionId.
 * 
 * @param {String | Number} gameId 
 * @param {String | Number} questionId 
 * @returns {Object | undefined} one certain question of that game.
 */
export async function queryQuestion(gameId, questionId) {
  try {
    const questions = await queryQuestions(gameId);
    const question = questions.filter((question) => question.id == questionId);
    return question;
  } catch(error) {
    throw new Error(error);
  }
}