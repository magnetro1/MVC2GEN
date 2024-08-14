// colors.js

// ANSI escape codes for formatting text in the terminal
const colors = {
  // Reset: This code resets all text attributes (color, boldness, underline, etc.) to the terminal's default settings.
  reset: "\x1b[0m",

  // Bright: This code makes the text bold or bright, depending on the terminal's interpretation. It’s often used to emphasize certain text.
  bright: "\x1b[1m",

  // Foreground Colors: A nested object 'fg' to hold ANSI codes for setting the text color.
  fg: {
    red: "\x1b[31m",    // Sets the text color to red.
    green: "\x1b[32m",  // Sets the text color to green.
    yellow: "\x1b[33m", // Sets the text color to yellow.
    cyan: "\x1b[36m",   // Sets the text color to cyan (light blue).
  },

  // Background Colors: You can add background colors if needed
  bg: {
    red: "\x1b[41m",    // Sets the background color to red.
    green: "\x1b[42m",  // Sets the background color to green.
    yellow: "\x1b[43m", // Sets the background color to yellow.
    cyan: "\x1b[46m",   // Sets the background color to cyan.
  }
};

export default colors;
