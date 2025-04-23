
/**
 * Generate id for each question
 * 
 * @returns {Number} question Id
 */
export function genId() {
  const quesId = +new Date()*100 + Math.floor(Math.random()*100);
  return quesId;
}