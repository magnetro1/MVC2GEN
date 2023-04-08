@echo off
:: enable delayed expansion to allow for ! in arguments
setlocal EnableDelayedExpansion
set args=
:: build the args string separated by commas
for %%i in (%*) do (
  set "args=!args!,"%%i""
)
node ../JS_UTIL_newmain.js !args!
timeout /t 50