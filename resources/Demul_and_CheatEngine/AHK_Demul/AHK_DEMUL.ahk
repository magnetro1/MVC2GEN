;Check & Run in Admin Mode
{
  full_command_line := DllCall("GetCommandLine", "str")
  
  if not (A_IsAdmin or RegExMatch(full_command_line, " /restart(?!\S)"))
  {
    try
    {
      if A_IsCompiled
      {
        Run *RunAs "%A_ScriptFullPath%" /restart
      }
      else
      {
        Run *RunAs "%A_AhkPath%" /restart "%A_ScriptFullPath%"
      }
    }
  }
}

;Environment stuff
{
  #SingleInstance, Force
  #NoEnv
  SendMode Input
  SetWorkingDir %A_ScriptDir%
  Menu, Tray, Icon, shell32.dll, 042 ;link to icons https://renenyffenegger.ch/development/Windows/PowerShell/examples/WinAPI/ExtractIconEx/shell32.html
  
}
;---------------------------------------------------------;
;------------------------forDemul+------------------------;
;---------------------------------------------------------;
; ^ : Ctrl, ! : Alt, + : Shift, # : Win, ~ : Apps
;------Separate Stuff

; F14 sends mouse Click
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
  F14::Send {Click Left}
  return
}

;Propagate-Character-Value Function --- Put the desired address in clipboard first
{
  !Numpad0::
    ;P1_A -> P2_C
    Send P1_A
    sleep 25
    SendInput {Tab}
    Send P2_C
    SendInput {Tab}
    Send 1C34 ;;;;;;
    SendInput {ENTER}
    sleep 100
    ;P1_A -> P2_B
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput {Tab}
    Send P2_B
    SendInput {Tab}
    Send 10EC ;;;;;;
    SendInput {ENTER}
    sleep 100
    ;P1_A -> P2_A
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput {Tab}
    Send P2_A
    SendInput {Tab}
    Send 5A4 ;;;;;;
    SendInput {ENTER}
    sleep 100
    ;P1_A -> P1_B
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput {Tab}
    Send P1_B
    SendInput {Tab}
    Send B48 ;;;;;;
    SendInput {ENTER}
    sleep 100
    ;P1_A -> P1_C
    Send ^v
    WinWait Paste table entries
    Send P1_A
    sleep 25
    SendInput {Tab}
    Send P1_C
    SendInput {Tab}
    Send 1690 ;;;;;;
    SendInput {ENTER}
    sleep 100
    ;P1_A ->  P1_A
    Send ^v
    WinWait Paste table entries
    SendInput {Tab}
    SendInput {Tab}
    SendInput {Tab}
    SendInput {Tab}
    SendInput {ENTER}
  return
}

; E as Stop Macro
{
#IfWinActive ahk_exe demul.exe
  E::
    SetKeyDelay 0, 1
    SendInput {7}
  return
}
; R as Stop,Reload State Only
{
#IfWinActive ahk_exe demul.exe
  R::
    SendInput {7}
    SetKeyDelay 0, 100
    SendInput {F10 Down}
    sleep 50
    SendInput {F10 Up}
    Send {=}
    sleep 100
    Send {=}
    SendInput {F10 Down}
    sleep 100
    SendInput {F10 Up}
  return
}

;-------Functions

;ReloadState
{
#IfWinActive ahk_exe demul.exe
  reloadState()
  {
    SendInput {7}
    SetKeyDelay 0, 100
    SendInput {F10 Down}
    sleep 50
    SendInput {F10 Up}
    Send {=}
    sleep 100
    Send {=}
    SendInput {F10 Down}
    sleep 100
    SendInput {F10 Up}
    return
  }
}
;Reload,Play State
{
#IfWinActive ahk_exe demul.exe
  reloadPlay()
  {
    SetKeyDelay 0, 90
    SendInput {7 Down}
    SendInput {7 Up}
    sleep 10
    SendInput {F10 Down}
    sleep 100
    SendInput {= Down}
    sleep 200
    SendInput {F10 Up}
    SendInput {= Up}
    SendInput {8}
  }
}

;-------Call Functions

;Reload & Pause
{
#IfWinActive ahk_exe demul.exe
  1::
    reloadState()
    sleep 400
    reloadPlay()
  return
}
;Reload & Unpause
{
  2::
#IfWinActive ahk_exe demul.exe
  Send 7
  sleep 100
  Send 7
  sleep 100
  reloadState()
  sleep 300
  reloadPlay()
  sleep 300
  Send 8
  sleep 430
  send {Q}
  return
}

;Reload & Unpause
{
#IfWinActive ahk_exe demul.exe
  3::
    SendInput {7 Down}
    sleep 100
    SendInput {7 Up}
    sleep 100
    SendInput {Q Down}
    sleep 50
    SendInput {Q Up}
    SendInput {F10 Down}
    sleep 300
    SendInput {= Down}
    sleep 200
    SendInput {= Up}
    SendInput {F10 Up}
    sleep 200
    SendInput {8 Down}
    sleep 100
    SendInput {8 Up}
    sleep 100
    SendInput {Q Down}
    sleep 100
    SendInput {Q Up}
  return
}