var myArr = [2, 5, 2, 5, 32, 3, 6, 4, 23, 6, 4, 23, 3, 32, 1, 3, 6, 4, 8, 8, 45, 3, "string", "dxvjsl", "string", "skd;als", "jdkfjsld"];

console.time("indexOf");
const res = myArr.filter((item, index, inputArray) =>
  inputArray.indexOf(item) == index);
console.log(res);
console.timeEnd("indexOf");

console.time("set");
const setVar = [...new Set(myArr)];
console.log(setVar);
console.timeEnd("set");

console.time("two");

function getUnique(arr)
{
  var unique = [];
  for (var i = 0; i < arr.length; i++)
  {
    if (!unique.includes(arr[i]))
    {
      unique.push(arr[i]);
    }
  }
  return unique;
}

var two = getUnique(myArr);
console.log(two);
console.log(two);
console.timeEnd("two");


myArr.filter((element) => element.length > 3);