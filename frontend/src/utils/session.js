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
 * Get active sessions from localStorage.
 * 
 * @returns {Array} activeSessions in localStorage
 */
function getActiveSessions() {
  return JSON.parse(localStorage.getItem('activeSessions'));
}

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
 * Check session state of session id or game id (Only input one.)
 * 
 * @param {String|Number} sessionId
 * @param {String|Number} gameId 
 * @returns {Boolean}
 */
export const checkSessionState = async (sessionId, gameId) => {
  if (sessionId && gameId){
    console.error('Can not pass both sessionId and gameId');
    return;
  }
  // only sessionId
  if (sessionId){
    try {
      const res = await apiCall(`/admin/session/${sessionId}/status`, 'GET');
      return res.results.active;
    } catch (error) {
      console.error('checkSessionState error:', error);
    }
  }

  // only gameId: 
  // If gameId not in activeSessions, return false
  const activeSessionsLocal = getActiveSessions();
  let session = activeSessionsLocal.find(session => session.gameId == gameId);
  if (session) { // If gameId in activeSessions, check activeSessionId.
    try {
      const res = await apiCall(`/admin/session/${session.activeSessionId}/status`, 'GET');
      return res.resuls.active;
    } catch (error) {
      console.error('checkSessionState error:', error);
    }
  } else {
    return false;
  }
}


/**
 * Send end request. Delete all sessions(remains) of that game in localStorage.
 * gameId sessionId must be passed at least one.
 * 
 * @param {Number | String | undefined} gameId 
 * @param {Number | String | undefined} sessionId 
 * @param {*} activeSessions from SessionContext
 * @param {*} setActiveSessions set function from SessionContext
 * @returns {*} respond from backend.
 */
export const endSession = async (gameId, sessionId, activeSessions, setActiveSessions) => {
  if (gameId === undefined){
    const session = activeSessions.find(session => session.activeSessionId == sessionId);
    gameId = session.gameId;
  }
  const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', {
    "mutationType": "END"
  })

  // double check backend the session status. If unactive, delete sessions in localstorage.
  setTimeout(() => {
    cleanSessions(activeSessions, setActiveSessions, gameId);
  }, 0);

  return res;
}

/**
 * Filter out unactive sessions in localStorage.
 * 
 * @param {Array} activeSessions 
 * @param {*} setActiveSessions 
 * @param {Number|String|undefined} gameId if undefined, clean all sessions. If defined, clean sessions about that game.
 * @returns {Array} active session[of that game].
 */
export async function cleanSessions(activeSessions, setActiveSessions, gameId) {
  let sessionsToClean = [];
  let sessionsNotClean = [];
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