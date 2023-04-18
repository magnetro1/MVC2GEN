// // // ! This might only be giving 1 set of entries, not n.
// import giantObject from './JS_UTIL_01_SortCSV.js';
// import findMinMaxRound from './JS_UTIL_02_MinMaxRound.js';

// let tempArr = [];
// for (const tempObj in findMinMaxRound(giantObject)) {
//   const playerMemoryRegex = /(P[1-2]_[A-C]_)/g; // [1] = P1_A
//   for (const key in giantObject[tempObj]) {
//     if (key.toString().match(playerMemoryRegex)) {
//       tempArr.push(key);
//     }
//   }
//   tempArr = tempArr.map((label) => label.replace(playerMemoryRegex, ''));
//   tempArr = [...new Set(tempArr)];
//   // console.log(tempArr);
// }
// const playerMemoryEntries = tempArr;

// export default playerMemoryEntries;
// // console.log(playerMemoryEntries);
