import { readFile } from 'node:fs';

readFile('./constObjects/constKnockdownState.js', 'utf8', (err, data) =>
{
  if (err) throw err;
  console.log(data);
});
