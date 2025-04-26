import { apiCall } from "../utils/api";

export const gameHandler = (gameId) => {
  const logStr = 'This is gameIdHandler...';
  return {
    log () {
      console.log(logStr);
    },

    logGID () {
      console.log(logStr, 'gameId: ', gameId);
    },

    async getAllGames() {
      const r =  await apiCall('/admin/games', 'GET');
      console.log(logStr, 'getAllGames: ', r);
    },

    async getQuestions() {

    }
  }
}