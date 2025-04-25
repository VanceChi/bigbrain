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
export function getLocalSessions() {
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
  console.log('starSessions');
  cleanSessions(activeSessions, setActiveSessions, gameId);
  const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', {
    "mutationType": "START"
  })
  const activeSessionId = res.data.sessionId;
  const updatedSession = [...activeSessions, { gameId, activeSessionId }];
  setActiveSessions(updatedSession);
  console.log('start session')
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
  if (sessionId && gameId) {
    console.error('Can not pass both sessionId and gameId');
    return;
  }
  // only sessionId
  if (sessionId) {
    try {
      const res = await apiCall(`/admin/session/${sessionId}/status`, 'GET');
      return res.results.active;
    } catch (error) {
      console.error('checkSessionState error:', error);
    }
  }

  // only gameId: 
  // If gameId not in activeSessions, return false
  const activeSessionsLocal = getLocalSessions();
  if (!activeSessionsLocal) return false;

  let sessions = activeSessionsLocal.filter(session => session.gameId == gameId);
  for (const session of sessions) {
    try {
      const res = await apiCall(`/admin/session/${session.activeSessionId}/status`, 'GET');
      if (res.results.active === true)
        return true;
    } catch (error) {
      console.error('checkSessionState error:', error);
    }
  }
  return false;
}


/**
 * Send end request. Delete all sessions(remains) of that game in localStorage.
 * ONLY pass one of gameId sessionId.
 * 
 * @param {Number | String | undefined} gameId 
 * @param {Number | String | undefined} sessionId 
 * @param {*} activeSessions from SessionContext
 * @param {*} setActiveSessions set function from SessionContext
 * @returns {*} respond from backend.
 */
export const endSession = async (gameId, sessionId, activeSessions) => {
  if (gameId === undefined) {
    const session = activeSessions.find(session => session.activeSessionId == sessionId);
    if (session === undefined) {
      console.log('Session already Ended.');
      return;
    }
    gameId = session.gameId;
  }
  const res = await apiCall(`/admin/game/${gameId}/mutate`, 'POST', {
    "mutationType": "END"
  })

  return res;
}

/**
 * Filter out unactive sessions in localStorage.
 * 
 * @param {Array} activeSessions 
 * @param {*} setActiveSessions 
 * @param {Number|String} gameId if undefined, clean all sessions. If defined, clean sessions about that game.
 * @returns {Array} active session[of that game].
 */
export async function cleanSessions(activeSessions, setActiveSessions, gameId) {
  if (!gameId) {
    console.log('cleanSession with no gameId !')
    return;
  }
  // Divide all active sessions -> toClean + notToClean
  let sessionsToClean = [];
  let sessionsNotClean = [];
  if (gameId) {  // if passed gameId, only clean sessions with that gameId
    sessionsToClean = activeSessions.filter(session => session.gameId == gameId);
    sessionsNotClean = activeSessions.filter(session => session.gameId != gameId);
  } else {
    sessionsToClean = activeSessions;
    sessionsNotClean = [];
  }

  const cleanedSessions = [];
  for (const session of sessionsToClean) {
    try {
      const res = await apiCall(`/admin/session/${session.activeSessionId}/status`, 'GET');
      if (res.results.active === true) cleanedSessions.push(session);
    } catch (err) {
      console.log('clean session, check session state error:', err);
    }
  }
  const newSessions = [...cleanedSessions, ...sessionsNotClean];
  setActiveSessions(newSessions);
  console.log('cleanSessions ! gameId:', gameId)
  localStorage.setItem('activeSessions', JSON.stringify(newSessions));

  return cleanedSessions;
}