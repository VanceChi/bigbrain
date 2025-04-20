/**
 * Deepcopy passed object
 * 
 * @param {Object} obj 
 * @returns Deepcopy of that object 
 */
export function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}