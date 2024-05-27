import readline from 'readline';

// Create an interface for reading data from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt the user for input
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Main function to execute the script
export async function main(query) {
  let resultAnswer = '';
  try {
    const answer = await askQuestion(query);

    // Check if the input is a string
    if (typeof answer === 'string' && answer.trim() !== '') {
      resultAnswer = answer;
      console.log(`Your answer is: ${answer}`);
    } else {
      console.log("Please enter a valid string.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    rl.close();
  }
  return resultAnswer;
}
