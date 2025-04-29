import { apiCall } from "../utils/api";

/**
 * 
 * @param {*} sessionId 
 * @returns 
 */
export async function adminGetSessionStatus(sessionId) {
  try {
    const res = await apiCall(`/admin/session/${sessionId}/status`, "GET");
    return res.results;
  } catch (err) {
    if (err.message === 'A system error ocurred') {
      return -4;
    }
  }
}

export async function adminGetGameResult(sessionId) {
  try {
    const res = await apiCall(`/admin/session/${sessionId}/results`, "GET");
    return res.results;
  } catch (err) {
    if (err.message === "A system error ocurred")
      return -4;
  }
}

/**
 * Get game state as gameState varible in session page.
 * 
 * @param {*} sessionId 
 * @returns 
     -4: Session id error.
     -3: Session finished. No player result.
     -2: Session finished. Show result.
     -1: Waiting. Game not started, session active.
      0: question index 0.  Game ongoing.
      1: question index 1.  Game ongoing.
      ...
 */
export async function adminGet_gameState(sessionId) {
  const results = await adminGetSessionStatus(sessionId);
  if (results === -4) return -4;
  if (results.active === false) {
    // Get results state 
    const r = await adminGetGameResult(sessionId);
    if (r.length === 0) return -3;
    else {
      return -2;
    }

  } else if (results.active === true) {
    // Get question position
    return results.position;
  }
}