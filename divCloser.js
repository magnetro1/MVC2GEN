
let stringOne = "<div> there is going to be som<div> <div >e text in the middle of thi^12s <ljlifsllj. <div>"
const fixDivTags = (stringFN) =>
{
  let foundDiv = 0;
  let textInTag = '';
  let resultText = '';
  for (let i = 0; i < stringFN.length; i++)
  {
    if (stringFN[i] === '<')
    {
      for (let j = 1; j < 5; j++)
      {
        textInTag += stringFN[i + j];
      }
    }
    // if we found it logic; else keep appending to resultText
    if (textInTag === 'div>')
    {
      foundDiv++;
      if (foundDiv % 2 === 0)
      {
        resultText += stringFN[i] + '/';
        textInTag = '';
        continue;
      }
    }
    resultText += stringFN[i];
    textInTag = '';
  }
  return resultText;
};
console.log(fixDivTags(stringOne));