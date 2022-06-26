@echo off
rem 2/4/2018 me: copied this shamelessly from stackoverflow -> https://stackoverflow.com/a/5802479
rem the name of the script is drive path name of the Parameter %0
rem (= the batch file) but with the extension ".ps1"
set PSScript=%~dpn0.ps1
set args=%1
:More
shift
if '%1'=='' goto Done
set args=%args%, %1
goto More
:Done
powershell.exe -NoProfile -Command "& '%PSScript%' '%args%'"