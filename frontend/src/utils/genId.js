
/**
 * Generate id for each question
 * 
 * @returns {Number} question Id
 */
export function genQuesID() {
  const quesId = +new Date()*100 + Math.floor(Math.random()*100);
  return quesId;
}