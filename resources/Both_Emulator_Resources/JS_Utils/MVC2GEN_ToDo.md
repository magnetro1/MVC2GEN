# To Do

1. Parity between pcsx2.ct and demul.ct file
  A. Addresses (special_strength...etc)
  B. Hotkeys (make sure there is no overlap or unwanted zeroing)
  C. Scripts that write the csv files have to be identical
1. Update CT scraper to work with demul, after the CTs are identical
  A. Make the whole thing a function that takes in DC or PS2.
  B. Make sure you add if-checks on the total_frames_ID
  C. Keep in mind the draw-pixel function after updating the CT file!
1. Update the readCSV() function to handle more than 5 re-records on data
  A. LOOK AT THE LUA CSVWRITER() IN CT to use a tempStr before writing to HDD.
1. Single launch command to run 'readCSV' and then newmain
  A. Automatically picking out the newest CSV file in CSV_FILES
  B. Sanitizing and passing the name of the file to the prompt inside of the readCSV.js
  C. Exporting the _Sorted_JS.js file into the folder.
  D. Passing the name of that into newmain.js
  E. Figure out how to use an argument for automatic or manual
1. If todo-3 works, newmain.js should exist inside of ./ so that the entire program can run from one root dir
