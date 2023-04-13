/*
  * @file JS_UTIL_CoreFn_Sleep.js
  * @brief Sleep function for JS
  * @param {number} ms - The amount of time to sleep in milliseconds
  * @return {Promise} - A promise that resolves after the specified amount of time
*/
export function sleep(ms)
{
  return new Promise(function (resolve)
  {
    return setTimeout(resolve, ms);
  });
}