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
  Menu, Tray, Icon, shell32.dll, 101
  ; icons https://renenyffenegger.ch/development/Windows/PowerShell/examples/WinAPI/ExtractIconEx/shell32.html
}

;-----------------------Misc.Functions-----------------------;
; ^ : Ctrl, ! : Alt, + : Shift, # : Win, ~ : Apps

;Accel-Scroll V1.3
{
  #MaxHotkeysPerInterval 120
  Process, Priority, , H
  SendMode Input
  
  ; Show scroll velocity as a tooltip while scrolling. 1 or 0.
  tooltips := 0
  
  ; The length of a scrolling session.
  ; Keep scrolling within this time to accumulate boost.
  ; Default: 500. Recommended between 400 and 1000.
  timeout := 600
  
  ; If you scroll a long distance in one session, apply additional boost factor.
  ; The higher the value, the longer it takes to activate, and the slower it accumulates.
  ; Set to zero to disable completely. Default: 30.
  boost := 60
  
  ; Spamming applications with hundreds of individual scroll events can slow them down.
  ; This sets the maximum number of scrolls sent per click, i.e. max velocity. Default: 60.
  limit := 60
  
  ; Runtime variables. Do not modify.
  distance := 0
  vmax := 1
  
  ; Key bindings
  WheelUp:: Goto Scroll
  WheelDown:: Goto Scroll
  ;~ #WheelUp::   Suspend
  ;~ #WheelDown:: Goto Quit
  
  Scroll:
    t := A_TimeSincePriorHotkey
    if (A_PriorHotkey = A_ThisHotkey && t < timeout)
    {
      ; Remember how many times we've scrolled in the current direction
      distance++
      
      ; Calculate acceleration factor using a 1/x curve
      v := (t < 80 && t > 1) ? (250.0 / t) - 1 : 1
      
      ; Apply boost
      if (boost > 1 && distance > boost)
      {
        ; Hold onto the highest speed we've achieved during this boost
        if (v > vmax)
          vmax := v
        else
          v := vmax
        v *= distance / boost
      }
      
      ; Validate
      v := (v > 1) ? ((v > limit) ? limit : Floor(v)) : 1
      
      if (v > 1 && tooltips)
        QuickToolTip("Ã—"v, timeout)
      MouseClick, %A_ThisHotkey%, , , v
    }
    else
    {
      ; Combo broken, so reset session variables
      distance := 0
      vmax := 1
      MouseClick %A_ThisHotkey%
    }
  return
  
  Quit:
    QuickToolTip("Exiting Accelerated Scrolling...", 1000)
    Sleep 1000
  ExitApp
  
  QuickToolTip(text, delay)
  {
    ToolTip, %text%
    SetTimer ToolTipOff, %delay%
    return
    
    ToolTipOff:
      SetTimer ToolTipOff, Off
      ToolTip
    return
  }
}

;-----------------------Small Binds-----------------------;

; MoveWin to Mouse        ^+F22
^+F22::
  Coordmode mouse, screen
  MouseGetPos xPos, yPos
  WinMove,A, , %xPos%, %yPos%, DEFAULT, DEFAULT
return

; if WinExist("ahk_exe AfterFX.exe")
; {
;   F12:: CapsLock
;   return
; }
