import { apiCall } from "../utils/api";

/**
 * 
 * @param {String|Number} playerId 
 * @returns {Array|undefined} 
 * If success: return array of results for each question.
 * If not seccess: (ongoing, playerId wrong)
 *  return undefined.
 */
export async function playGetResult(playerId) {
  try {
    const res = await apiCall(`/play/${playerId}/results`, 'GET');
    // debugger
    return res;
  } catch (error) {
    console.error(error);
    return ;
  }
}

/**
 * Get Current question details
 * 
 * @param {String|Number} playerId 
 * @returns {Object {}} secceed: {...} , unseccessful: {}
 */
export async function playGetQuestion(playerId) {
  try {
    // All res value:
    // {"error":"Session ID is not an active session"}
    // {...}
    // {"error":"Player ID does not refer to valid player id"}
    const res = await apiCall(`/play/${playerId}/question`, 'GET');
    if (res.error) {
      console.error(res.error);
      return {};
    }
    return res.question;
  } catch (error) {
    console.error(error);
    return {};
  }
}


/**
 * Get game status: waiting, ongoing, just ended.
 * 
 * @param {String|Number} playerId 
 * @returns { Number }
 * -2: playerId invalid.
 * -1: Session ended.
 *  0: Waiting. Game not started, session active.
 *  1: Game ongoing.
 */
export async function playGetStatus(playerId) {
  try {
    /**
       res:
     - session ended: {"error": "Session ID is not an active session"}
     - invalid playerId: {"error":"Player ID does not refer to valid player id"}
     - session active: game not started: {"started":false}
     - session active: game started: {"started":true}
     */
    const res = await apiCall(`/play/${playerId}/status`, 'GET');
    return Number(res.started);
  } catch (error) {
    const message = error.message;
    if (message === 'Session ID is not an active session') {
      return -1;
    } else if (message === 'Player ID does not refer to valid player id') {
      return -2;
    }
    return;
  }
}