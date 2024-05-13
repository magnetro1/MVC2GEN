; Check & Run in Admin Mode
{
  full_command_line:= DllCall("GetCommandLine", "str")
  
  if not(A_IsAdmin or RegExMatch(full_command_line, " /restart(?!\S)"))
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

; Environment stuff
{
  #SingleInstance, Force
  #NoEnv
  SendMode Input
  SetWorkingDir %A_ScriptDir%
  Menu, Tray, Icon, shell32.dll, 105
  ; icons https://renenyffenegger.ch/development/Windows/PowerShell/examples/WinAPI/ExtractIconEx/shell32.html
}

; ------------------------PCSX2RR-----------------------;
; ahk_class GSWndDX
; ahk_exe pcsx2.exe
; ahk_pid 1560
; ahk_id 593960

; MovePCSX2 Both Window and Console
#IfWinActive ahk_exe pcsx2.exe
  #M::
    SendInput { LWin Down } { Numpad4 Down }
    sleep 100
    SendInput { LWin Up } { Numpad4 Up }
    sleep 10
    WinActivate ahk_class ConsoleWindowClass
    SendInput { LWin Down } { Numpad3 Down }
    sleep 100
    SendInput { LWin Up } { Numpad3 Up }
    Sleep 100
    SendInput, {LWinUp}
    WinActivate ahk_exe pcsx2.exe
    SendInput, {LWinUp}
  return
#If ; end of PCSX2RR

; ------------------------Cheat Engine-----------------------;
; Cheat Engine 7.4
; ahk_class Window
; ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
; ahk_pid 21896
; ahk_id 1115140

; Propagate - PMem
;; make a global variable

; Put the desired P1_A_Address in clipboard first!
#IfWinActive, ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
  pasteOffset(fnChar, fnOffset)
  {
    Send ^v
    WinWait Paste table entries
    Send P1_A_
    SendInput {Tab}
    Sleep 10
    SendInput, %fnChar%
    Sleep 10
    SendInput {Tab}
    Sleep 10
    SendInput, %fnOffset%
    Sleep, 10
    SendInput {Enter}
    Sleep, 10
    SendInput {Ctrl Up}
    return
  }
  
  !3::
    {
      offsetObj := {P1_A_ : "0", P1_B_: "B70", P1_C_: "16E0", P2_A_: "5B8", P2_B_: "1128", P2_C_: "1C98" }
      for key, value in offsetObj
      {
        pasteOffset(key, value)
      }
      return
    }
  
  !6::
    ; Pl_A -> Pl_B
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput { Tab }
    Send P1_B
    sleep 25
    SendInput { Tab }
    Send B70
    sleep 25
    SendInput { Enter }
    sleep 100
    ; Pl_A -> Pl_C
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput { Tab }
    Send P1_C
    sleep 25
    SendInput { Tab }
    Send 16E0
    sleep 25
    SendInput { Enter }
    sleep 100
    ; Pl_A -> P2_A
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput { Tab }
    Send P2_A
    sleep 25
    SendInput { Tab }
    Send 5B8
    sleep 25
    SendInput { Enter }
    sleep 100
    ; Pl_A -> P2_B
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput { Tab }
    Send P2_B
    sleep 25
    SendInput { Tab }
    Send 1128
    sleep 25
    SendInput { Enter }
    sleep 100
    ; Pl_A -> P2_C
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput { Tab }
    Send P2_C
    sleep 25
    SendInput { Tab }
    Send 1C98
    sleep 25
    SendInput { Enter }
    sleep 100
  return
  
  ; Copies the address in the pointer for pasting
  ; ^3:: ; this is a function that does not require a hotkey; it gets called later on
  copyPointer()
  {
    CoordMode, Mouse, Screen
    MouseGetpos xVar, yVar
    SendInput { LButton }
    Sleep 10
    SendInput { LButton }
    winwait, Change address
    
    send ^C
    sleep 10
    Send { Esc }
    CoordMode, Mouse, Screen
    MouseMove, %xVar%, %yVar%
    return
  }
  
  ; Recalculates and address by pasting the clipboard contents into the address field
  ; ^3:: ; this is a function that does not require a hotkey; it gets called later on
  pastePointer()
  {
    CoordMode, Mouse, Screen
    MouseGetPos xVar, yVar
    Send { RButton }
    sleep 100
    SendInput r
    WinWait Recalculate addres
    sleep 200
    CoordMode, Mouse, Relative
    MouseClick, left, 160, 40
    Send, ^a
    sleep 10
    Send, ^v
    sleep 30
    Send { Enter }
    CoordMode, Mouse, Screen
    MouseMove, %xVar%, %yVar%
    return
  }
  
  ; Image-search, uses copyPointer and pastePointer functions.
  ^F3::
    ImageSearch, TimerPointerX, TimerPointerY, 0, 0, A_ScreenWidth, A_ScreenHeight, A_GameTimer_Pointer.png
    if (ErrorLevel = 2)
    {
      MsgBox "Could not conduct the search."
    }
    else if (ErrorLevel = 1)
    {
      MsgBox Could not find "A_GameTimer_Pointer"
    }
    else
    {
      MouseMove, %TimerPointerX%,%TimerPointerY%
      MouseMove, 50, 2, 0, R
      copyPointer()
      sleep 120
    }
    
    ; Searches for GameTimer Address:
    ImageSearch, TimerX, TimerY, 0, 0, A_ScreenWidth, A_ScreenHeight, A_GameTimer_Address.png
    if (ErrorLevel = 2)
    {
      MsgBox "Could not conduct the search."
    }
    else if (ErrorLevel = 1)
    {
      MsgBox "Could not find A_GameTimer_Address"
    }
    else
    {
      CoordMode Mouse, Relative
      MouseMove, %TimerX%, %TimerY%,
      pastePointer()
      sleep 150
    }
    
    ;Searches for SCV Pointer
    CoordMode, Mouse, Relative
    ImageSearch, SCVPointerX, SCVPointerY, 0, 0, A_ScreenWidth, A_ScreenHeight, A_SCV_Pointer.png
    if (ErrorLevel = 2)
    {
      MsgBox Could not conduct the search.
    }
    else if (ErrorLevel = 1)
    {
      MsgBox Could not find" A_SCV_Pointer"
    }
    else
    {
      CoordMode, Mouse, Relative
      MouseMove, %SCVPointerX%, %SCVPointerY%
      MouseMove, 50, 2, 0, R
      copyPointer()
      sleep 200
    }
    
    ;Searches for SCV address
    CoordMode, Mouse, Relative
    ImageSearch, SCVX, SCVY, 0, 0, A_ScreenWidth, A_ScreenHeight, A_SCV_Address.png
    if (ErrorLevel = 2)
    {
      MsgBox Could not conduct the search.
    }
    else if (ErrorLevel = 1)
    {
      MsgBox Could not find "A_SCV_Address"
    }
    else
    {
      CoordMode, Mouse, Relative
      MouseMove, %SCVX%, %SCVY%
      pastePointer()
    }
  return
#If ; end of Cheat Engine
