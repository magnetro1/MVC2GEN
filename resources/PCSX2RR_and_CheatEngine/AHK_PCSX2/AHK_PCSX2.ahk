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
Menu, Tray, Icon, shell32.dll, 105 ;

}

;---------------------------------------------------------;
;------------------------forPCSX2RR-----------------------;
;---------------------------------------------------------;
;MovePCSX2_NEW
{
	#M::
	#IfWinActive ahk_class PCSX2 Main
	SendInput {LWin Down}{Numpad3 Down}
	sleep 100
	SendInput {LWin Up}{Numpad3 Up}
	sleep 10
	#IfWinActive ahk_class PCSX2 Main
	sleep 10
	WinActivate ahk_class ConsoleWindowClass
	SendInput {LWin Down}{Numpad4 Down}
	sleep 100
	SendInput {LWin Up}{Numpad4 Up}
	Sleep 10
	WinActivate ahk_class PCSX2 Main
	return
}
;Propagate-Character-Value Function --- Put the desired address in clipboard first
{

#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
^Numpad0::
;Pl_A -> Pl_B
Send ^v
WinWait Paste table entries
Send P1_A
sleep 25
SendInput {Tab}
Send P1_B
sleep 25
SendInput {Tab}
Send B70
sleep 25
SendInput {Enter}
sleep 100
;Pl_A -> Pl_C
Send ^v
WinWait Paste table entries
Send P1_A
sleep 25
SendInput {Tab}
Send P1_C
sleep 25
SendInput {Tab}
Send 16E0
sleep 25
SendInput {Enter}
sleep 100
;Pl_A -> P2_A
Send ^v
WinWait Paste table entries
Send P1_A
sleep 25
SendInput {Tab}
Send P2_A
sleep 25
SendInput {Tab}
Send 5B8
sleep 25
SendInput {Enter}
sleep 100
;Pl_A -> P2_B
Send ^v
WinWait Paste table entries
Send P1_A
sleep 25
SendInput {Tab}
Send P2_B
sleep 25
SendInput {Tab}
Send 1128
sleep 25
SendInput {Enter}
sleep 100
;Pl_A -> P2_C
Send ^v
WinWait Paste table entries
Send P1_A
sleep 25
SendInput {Tab}
Send P2_C
sleep 25
SendInput {Tab}
Send 1C98
sleep 25
SendInput {Enter}
sleep 100
return
}
;Special Reload?
{
#B::
#IfWinActive ahk_exe pcsx2.exe
SetKeyDelay, 0,110
Send {F3 Down}
sleep 150
SendInput {F3 Up}
sleep 400
Send {Space Down}
sleep 50
Send {Space Up}
Send LWin {Up}
Send ^+I
sleep 1500
Send ^+I
sleep 10
Send {+ UP}
return
}
;Lua Script Path for CE			#F3
{
#F4::
SendRaw, E:\New Folder\Inchoate_CV\Main\Scripts\Lua
return
}
;Clip() IncLua					#F2 - Writes a directory to the clipboard and pastes it if Cheat Engine is active
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
#F2::
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
SendRaw "E:\New Folder\Inchoate_CV\Main\Scripts\Lua"
return
}
;Copy Pointer					^3 - Copies the address derived by the pointer
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
^3::
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
copyPointer()
{
CoordMode, Mouse, Screen
MouseGetpos xVar, yVar
; SendInput {^!Enter}
SendInput {LButton}
Sleep 10
SendInput {LButton}
winwait, Change address
; sleep 1000
; Send {Tab}
; sleep 1000
; Send {Tab}
; sleep 2000
; Send {Space}
; sleep 1000
; Send {Tab}
; sleep 1000
; Send {Tab}
; sleep 1000
; Send {Tab}
; sleep 1000
send ^C
sleep 10
Send {Esc}
CoordMode, Mouse, Screen
MouseMove, %xVar%, %yVar%
return
}

}
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
findDesc(nameA)
{
CoordMode Mouse,Screen 
MouseGetPos varX, varY,
nameA =
If varX between 1050 and 1125
	nameA = 1.png
else if varX between 1245 and 1325
	nameA = 2.png
else if varX between 1450 and 1520
	nameA = 3.png
else if varX between 1650 and 1720
	nameA = 4.png
else if varX between 1850 and 1920
	nameA = 5.png
else if varX between 2050 and 2125
	nameA = 6.png
else nameA = 0.png
sleep 100
CoordMode, Mouse, Relative
ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, %nameA%
if (ErrorLevel = 2)
    MsgBox Could not conduct the search.
else if (ErrorLevel = 1)
	MsgBox Could not find item.
else
   ;BlockInput, on
   MouseMove, %FoundX%,%FoundY%
   BlockInput, off
   BlockInput, MouseMoveOff
return
}
}
;pasteClipboard Function		Recalculates and address by pasting the clipboard contents into the address field
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
pasteClip()
{
CoordMode, Mouse, Screen
MouseGetPos xVar, yVar
Send {RButton}
sleep 100 
SendInput r
WinWait Recalculate addres
sleep 200
CoordMode, Mouse, Relative
MouseClick, left,  160,  40
Send, ^a
sleep 10
Send, ^v 
sleep 30
Send {Enter}
CoordMode, Mouse, Screen
MouseMove, %xVar%,%yVar%
return
}
}
;TapSpace & Switch Function 	Switches to PSCSX2 to press space once so as to trigger NOP recognition)
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
tapSpace()
	{
	WinActivate ahk_class GSWndDX
	sleep 10
	Send {space down}
	sleep 90
	send {space up}
	sleep 50
	WinActivate ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
	return
	}
}

;Switch PCSX2 for StreamDeck	Switches the active window from PCSX2-Console to the main game-window -- for Stream Deck
{
#IfWinActive ahk_class ConsoleWindowClass
#F12::
{
WinActivate ahk_class PCSX2 Main
return
}
}
;Invoke collapseTable			#F11 - Sets up CE for SD macro and AHK searches
;~ {
;~ #IfWinActive ahk_class PCSX2 Main
;~ #F11::
;~ {
;~ WinActivate ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
;~ Sleep 200
;~ Send {Down} ; first down-press
;~ sleep 100
;~ collapseTable() ; ~5 seconds to execute
;~ return
;~ }
;~ }
;Invoke findDesc				#F9 - Click over the Lua window's "Execute" button (from left to right)
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
#F9::
{
CoordMode, Mouse, Screen
MouseGetPos, varX, varY
MouseClick
CoordMode, Mouse, Relative
sleep 200
findDesc(nameA)
sleep 50
pasteClip()
sleep 50
CoordMode, Mouse, Screen
MouseMove, varX, varY
return
}
}
;Invoke pasteClip				#F1 - Executes pasteClip function (used in other places)
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
#F1::
pasteClip()
return
}
;NOP READ  |1| 					^F4 - NOPs out the first instruction that READS to this address.
{
#IfWinActive Cheat Engine 7.4 ;ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
^F4::
#IfWinActive Cheat Engine 7.4 ;ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
CoordMode Mouse, Screen
MouseGetPos, myX, myY
SendInput {F6}
winwait,  The following
sleep 200
tapSpace()
sleep 360
CoordMode Mouse, Relative
MouseClick, right, 40, 60
MouseClick, left, 50, 65
sleep 200
SendInput {return}
sleep 200
SendInput {tab}
sleep 100
SendInput {tab}
sleep 20
SendInput {space}
sleep 20
SendInput {space}
sleep 20
CoordMode, Mouse, Screen
MouseMove, myX, myY
return
sendinput ^
}
;NOP WRITE |1 & 3| 				^F6 - NOPs out the first and third instruction that writes to this address.
{
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
^F6::
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
CoordMode Mouse, Screen
MouseGetPos, myX,myY
SendInput {F5}
winwait,  The following
sleep 50
tapSpace()
sleep 100
CoordMode Mouse, Relative
MouseClick, right, 40, 60
MouseClick, left, 50, 65
sleep 10
SendInput {return}
sleep 100
MouseClick, right, 40, 105
MouseClick, left, 50, 115
sleep 10
SendInput {return}
sleep 100
SendInput {tab}
sleep 20
SendInput {tab}
sleep 20
SendInput {space}
sleep 30
SendInput {space}
sleep 100
CoordMode, Mouse, Screen
MouseMove, myX, myY
return
sendinput ^
}
;NOP WRITE |3| 					^F7 - NOPs out the third instruction that writes to this address
{
#IfWinActive Cheat Engine 7.4 ;ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
^F7::
#IfWinActive Cheat Engine 7.4;ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
CoordMode Mouse, Screen
MouseGetPos, myX,myY
SendInput {F5}
winwait,  The following
sleep 50
tapSpace()
sleep 100
CoordMode Mouse, Relative
MouseClick, right, 40, 105
MouseClick, left, 50, 115
sleep 10
SendInput {return}
sleep 100
SendInput {tab}
sleep 20
SendInput {tab}
sleep 20
SendInput {space}
sleep 30
SendInput {space}
sleep 100
CoordMode Mouse, Screen
MouseMove, myX,myY
return
sendinput ^
}
;Invoke 2D Pointer Search		^F3 - Uses 4 Image-Searches and the pasteClip function to recalculate 2D offsets
{
	
; Searches for GameTimer Pointer
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
^F3::
#IfWinActive ahk_exe cheatengine-x86_64-SSE4-AVX2.exe
ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, A_GameTimer_Pointer.png 
if (ErrorLevel = 2)
    MsgBox Could not conduct the search.
else if (ErrorLevel = 1)
	MsgBox Could not find "A_GameTimer_Pointer"
else
   MouseMove, %FoundX%,%FoundY%
   MouseMove, 50, 2, 0, R
copyPointer()
sleep 200

; Searches for GameTimer Address:
ImageSearch, XG, YG, 0, 0, A_ScreenWidth, A_ScreenHeight, A_GameTimer_Address.png ; searches for GameTimer address
if (ErrorLevel = 2)
    MsgBox Could not conduct the search.
else if (ErrorLevel = 1)
	MsgBox Could not "A_GameTimer_Address"
else
	CoordMode Mouse, Relative
    MouseMove, %XG%, %YG%,
	pasteClip()
sleep 150

;Searches for SCV Pointer
CoordMode, Mouse, Relative
ImageSearch, XX, YY, 0, 0, A_ScreenWidth, A_ScreenHeight, A_SCV_Pointer.png
if (ErrorLevel = 2)
    MsgBox Could not conduct the search.

else if (ErrorLevel = 1)
	MsgBox Could not find" A_SCV_Pointer"
else   
   CoordMode, Mouse, Relative
   MouseMove, %XX%, %YY%
   MouseMove, 50, 2, 0, R 
copyPointer()
sleep 200

;Searches for SCV address
CoordMode, Mouse, Relative
ImageSearch, XA, YA, 0, 0, A_ScreenWidth, A_ScreenHeight, A_SCV_Address.png
if (ErrorLevel = 2)
    MsgBox Could not conduct the search.
else if (ErrorLevel = 1)
	MsgBox Could not find "A_SCV_Address"
else	
	CoordMode, Mouse, Relative
    MouseMove, %XA%, %YA%
	pasteClip()
return
}