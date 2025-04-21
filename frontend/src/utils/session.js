// session.js
import { apiCall } from "./api";

/**
 * Only one session of a game can be active at one time.
 * 
 * activeSessions: [ 
 *   {gameId: gameId, activeSessionId: sessionId},
 *   {...} 
 * ]
 */


/**
 * Start Session of the game.
 * 
 * @param {*} gameId the game of the session
 * @param {*} activeSessions from SessionContext
 * @param {*} setActiveSessions set function from SessionContext
 * @returns {*} active Session Id
 */
export const startSession = async (gameId, activeSessions, setActiveSessions) => {
  const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', {
    "mutationType": "START"
  })
  const activeSessionId = res.data.sessionId;
  const updatedSession = [...activeSessions, { gameId, activeSessionId }];
  setActiveSessions(updatedSession);
  localStorage.setItem('activeSessions', JSON.stringify(updatedSession));
  return activeSessionId;
};

/**
 * Send end request.
 * Delete all sessions(remains) of that game in localStorage.
 * 
 * @param {*} sessionId 
 * @param {*} activeSessions from SessionContext
 * @param {*} setActiveSessions set function from SessionContext
 * @returns {*} respond from backend.
 */


export const endSession = async (gameId, activeSessions, setActiveSessions) => {
  const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', {
    "mutationType": "END"
  })

  // double check backend the session status. If unactive, delete sessions in localstorage.
  setTimeout(() => {
    cleanSessions(activeSessions, setActiveSessions, gameId);
  }, 100);

  return res;
}

/**
 * If gameId not given: return active sessions.
 * If gameId given: return active session of that game.
 * @returns {Array}
 */
export async function checkSession(gameId, activeSessions, setActiveSessions) {
  // filter out unactive sessions
  const updatedSessions = await cleanSessions(activeSessions, setActiveSessions);

  if (gameId) {
    const gameSession = updatedSessions.filter(session => session.gameId == gameId);
    return gameSession; // [one session] or []
  }

  return updatedSessions;
}

/**
 * Filter out unactive sessions in localStorage.
 * 
 * @param {*} activeSessions 
 * @param {*} setActiveSessions 
 * @param {*} gameId if undefined, clean all sessions. If defined, clean sessions about that game.
 * @returns {Array} active session[of that game].
 */
export async function cleanSessions(activeSessions, setActiveSessions, gameId) {
  let sessionsToClean = null;
  let sessionsNotClean = null;
  if (gameId){
    sessionsToClean = activeSessions.filter(session => session.gameId == gameId);
    sessionsNotClean = activeSessions.filter(session => session.gameId != gameId); 
  } else {
    sessionsToClean = activeSessions;
    sessionsNotClean = [];
  }

  const cleanedSessions = [];
  for (const session of sessionsToClean) {
    const res = await apiCall(`/admin/session/${session.activeSessionId}/status`, 'GET');
    if (res.results.active === true) cleanedSessions.push(session);
  }
  const newSessions = [...cleanedSessions, ...sessionsNotClean];
  setActiveSessions(newSessions);
  
  localStorage.setItem('activeSessions', JSON.stringify(newSessions));

  return cleanedSessions;
}