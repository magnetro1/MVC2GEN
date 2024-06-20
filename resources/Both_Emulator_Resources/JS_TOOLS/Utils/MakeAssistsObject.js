import fs from 'fs';
import { finished } from 'stream/promises';
import path from 'path';
import csv from 'csv-parser';
import { DIR_BOTH_EMULATOR_RESOURCES } from './Paths.js';

const CSV_FILE = path.join(DIR_BOTH_EMULATOR_RESOURCES, 'assists.csv');

async function GetAssistObject() {
  const ASSIST_OBJECT = {};
  const stream = fs.createReadStream(CSV_FILE).pipe(csv());

  stream.on('data', (rowAsObject) => {
    const Name = rowAsObject['Name'].toString();
    ASSIST_OBJECT[Name] = rowAsObject;
  });

  try {
    await finished(stream);
    console.log('CSV file successfully processed');
    return ASSIST_OBJECT;
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
}

export default GetAssistObject;

async function GetAsyncAssistObject() {
  try {
    const ASSIST_OBJECT = await GetAssistObject();
    console.log(ASSIST_OBJECT);
    // You can now use ASSIST_OBJECT here
  } catch (error) {
    console.error('Error:', error);
  }
}

// GetAsyncAssistObject();
