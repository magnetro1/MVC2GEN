#NoEnv ; Recommended for performance and compatibility with future AutoHotkey releases.
SendMode Input ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir% ; Ensures a consistent starting directory.
NewPattern := ""
PatternWorking := Object()
lastPattern := Object()

FileSelectFile, patternFile, 3
FileRead, AllPatterns, %patternFile%
AllPatterns:=RegExReplace(AllPatterns, "`r`n", "delimit")
Patterns := StrSplit(AllPatterns, "delimit")

for i, e in Patterns
{
  loopPattern := StrSplit(Patterns[i], [A_Space])
  for index, element in loopPattern
  {
    if (lastPattern[index] == "")
      continue
    
    if (PatternWorking[index] == "??")
      continue
    
    if ( (loopPattern[index] == lastPattern[index]) )
    {
      PatternWorking.Remove(index)
      PatternWorking.Insert(index, loopPattern[index])
      PatternWorking.Insert(" ")
    }
    if ( (loopPattern[index] != lastPattern[index]) && (loopPattern[index] != PatternWorking[index]) )
    {
      PatternWorking.Remove(index)
      PatternWorking.Insert(index, "??")
      PatternWorking.Insert(" ")
    }
  }
  lastPattern := loopPattern
}
for i, e in PatternWorking
{
  NewPattern .= Patternworking[i]
  NewPattern .= " "
}
NewPattern:=RegExReplace(NewPattern,"` +","` ")
Gui, +Resize
Gui, Show, xCenter yCenter h200 w500, sigmaker
Gui, Add, Edit, ReadOnly vPatternEdit, % NewPattern
Gui, Add, Button, , Copy to Clipboard
return

ButtonCopytoClipboard:
  GuiControlGet, PatternEditContent,, PatternEdit
  Clipboard := PatternEditContent
return

GuiClose:
ExitApp
return