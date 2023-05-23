;header1 (Check & Run in Admin Mode
{
  full_command_line := DllCall("GetCommandLine", "str")
  if not (A_IsAdmin or RegExMatch(full_command_line, " /restart(?!\S)"))
  {
    try
    {
      if A_IsCompiled
        Run *RunAs "%A_ScriptFullPath%" /restart
      else
        Run *RunAs "%A_AhkPath%" /restart "%A_ScriptFullPath%"
    }
  }
}

;header2 Environment stuff
{
  #SingleInstance, Force
  #NoEnv
  SendMode Input
  SetWorkingDir %A_ScriptDir%
  Menu, Tray, Icon, shell32.dll, 110 ;
}
;; left click and drag my mouse in a straight line down. map this function to the Q key.
q::
  Send {Lbutton Down}
  SendInput LButton Down
  MouseGetPos, xpos, ypos
  MouseMove, xpos, ypos+500, 100
  Send {Lbutton Up}
return
