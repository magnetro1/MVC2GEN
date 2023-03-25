// Move the mouse across the screen as a sine wave.
// import * as robot from "robotjs"
var robot = require("robotjs");
// Speed up the mouse.
robot.setMouseDelay(20);

var twoPI = Math.PI * 5.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

for (var x = 0; x < width; x++)
{
  y = height * Math.sin((twoPI * x) / width) + height;
  robot.moveMouse(x, y);
}