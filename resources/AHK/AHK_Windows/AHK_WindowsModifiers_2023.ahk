;header1 (Check & Run in Admin Mode
{full_command_line := DllCall("GetCommandLine", "str")
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
  Menu, Tray, Icon, shell32.dll, 101 ;
}

;------------------------------------------------------------;
;-----------------------Misc.Functions-----------------------;
;------------------------------------------------------------;

;Accel-Scroll V1.3        MWheel
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

; Clip() - Send and Retrieve Text Using the Clipboard
{
  Clip(Text="", Reselect="")
  {
    Static BackUpClip, Stored, LastClip
    If (A_ThisLabel = A_ThisFunc) {
      If (Clipboard == LastClip)
        Clipboard := BackUpClip
      BackUpClip := LastClip := Stored := ""
    } Else {
      If !Stored {
        Stored := True
        BackUpClip := ClipboardAll ; ClipboardAll must be on its own line
      } Else
        SetTimer, %A_ThisFunc%, Off
      LongCopy := A_TickCount, Clipboard := "", LongCopy -= A_TickCount ; LongCopy gauges the amount of time it takes to empty the clipboard which can predict how long the subsequent clipwait will need
      If (Text = "") {
        SendInput, ^c
        ClipWait, LongCopy ? 0.6 : 0.2, True
      } Else {
        Clipboard := LastClip := Text
        ClipWait, 10
        SendInput, ^v
      }
      SetTimer, %A_ThisFunc%, -700
      Sleep 20 ; Short sleep in case Clip() is followed by more keystrokes such as {Enter}
      If (Text = "")
        Return LastClip := Clipboard
      Else If ReSelect and ((ReSelect = True) or (StrLen(Text) < 3000))
        SendInput, % "{Shift Down}{Left " StrLen(StrReplace(Text, "`r")) "}{Shift Up}"
    }
    Return
    Clip:
    Return Clip()
  }
}
;---------------------------------------------------------;
;-------------------🥜Small Binds🥜----------------------;
;---------------------------------------------------------;

;Always-on-Top          Win+Space
{
  #SPACE:: Winset, Alwaysontop, , A
}

;#Notepad            Win+N
{
  #n::
    IfWinNotExist, ahk_class Notepad
      Run, notepad.exe
    WinActivate ahk_class Notepad
  return
}

;MoveWin to Mouse        ^+F22
{
  ^+F22::
    Coordmode mouse, screen
    MouseGetPos xPos, yPos
    WinMove,A, , %xPos%, %yPos%, DEFAULT, DEFAULT
  return
}

;Task Manager          RWin
RWin:: ^+Esc
return

;Launch LGS            ^+F15
{
  ^+F15::
    switchToLGS()
    {
      IfWinNotExist, ahk_exe LCore.exe
        Run, C:\Program Files\Logitech Gaming Software\LCore.exe
      WinWait, Logitech Gaming Software,
      if WinActive("ahk_exe LCore.exe")
        Sendinput ^{tab}
      else
        WinActivate ahk_exe LCore.exe
      sleep 2
      WinWaitActive, Logitech Gaming Software,
    }
  return
}

;Task Manager          RWin
^+F12:: SendRaw,E:\Progs-S\`PC(2016.Win10)\`P1 Software\Stream Deck\Icons
return

#IfWinActive ahk_exe AfterFX.exe
  F12:: CapsLock
  return
#IfWinActive ; ahk_exe AfterFX.exe

#IfWinActive ahk_exe SC2_x64.exe
  +WheelDown:: MouseClick, Right
  return
#IfWinActive ; ahk_exe SC2_x64.exe

Morse(timeout = 250) { ;
  tout := timeout/1000
  key := RegExReplace(A_ThisHotKey,"[\*\~\$\#\+\!\^]")
  Loop {
    t := A_TickCount
    KeyWait %key%
    Pattern .= A_TickCount-t > timeout
    KeyWait %key%,DT%tout%
    If (ErrorLevel)
      Return Pattern
  }
}
; ~q::
;   resultVar:= Morse()

;   If (resultVar= "0") ; Tap
;   {
;     msgbox, Tap
;   }

;   Else If (resultVar= "1") ;Hold
;   {
;     Msgbox, Hold
;   }

;   Else If (resultVar= "01") ;Tap, Hold
;   {
;     Msgbox, Tap, Hold
;   }

;   Else If (resultVar= "00") ;Tap, Tap
;   {
;     Msgbox, Tap, Tap
;   }

;   Else If (resultVar= "000") ;Tap, Tap, Tap
;   {
;     Msgbox, Tap, Tap, Tap
;   }

;   Else If (resultVar= "0000") ;Tap, Tap, Tap, Tap
;   {
;     Msgbox, Tap, Tap, Tap, Tap
;   }

;   Else If (resultVar= "00000") ;Tap, Tap, Tap, Tap, Tap
;   {
;     Msgbox, Tap, Tap, Tap, Tap, Tap
;   }

;   Else If (resultVar= "10000") ;Hold, Tap, Tap, Tap, Tap
;   {
;     Msgbox, Hold, Tap, Tap, Tap, Tap
;   }

;   Else
;     Return