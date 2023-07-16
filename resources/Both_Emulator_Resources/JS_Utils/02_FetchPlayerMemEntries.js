import {
  dataObject,
} from './00_DataObject.js';

/**
 * @description Finds the player memory addresses inside of the dataObject
 * and returns an array of the unique items. The other core functions will
 * push more entries into the dataObject before it gets processed by this
 * function.
 * 
 * @returns {String[]} returns an array of strings to be processed by the
 * main player-memory-function.
*/
function getPlayerMemoryEntries() {
  let playerMemoryEntries = [];
  let playerMemoryRegex = /(P[1-2]_[A-C]_)/g; //[1] = P1_A
  for (let key in dataObject) {
    if (key.toString().match(playerMemoryRegex)) {
      playerMemoryEntries.push(key);
    }
  }
  // remove prefixes and make into set
  playerMemoryEntries = playerMemoryEntries.map((label) => {
    return label.replace(playerMemoryRegex, '');
  });
  playerMemoryEntries = [...new Set(playerMemoryEntries)];
  // clipboardy.writeSync(playerMemoryEntries.join('\n'));
  return playerMemoryEntries;
}

getPlayerMemoryEntries();

export { getPlayerMemoryEntries }
