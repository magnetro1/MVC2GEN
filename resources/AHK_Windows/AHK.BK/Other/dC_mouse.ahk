{#SingleInstance, Force
#NoEnv
}

F3::
;MovePCSX2 Function				Moves PCSX2 Main, and then PCSX2 Console
{
#IfWinActive ahk_class PCSX2 Main
SendInput {LWin Down}{Numpad3 Down}
sleep 100
SendInput {LWin Up}{Numpad3 Up}
return

}
;~ CoordMode, Mouse, Screen
;~ MouseGetPos, xVar, yVar
;~ MouseClick Left
;~ sleep 100
;~ MouseClick Left
;~ sleep 20
;~ CoordMode, Mouse, Screen
;~ MouseMove, xVar,yVar+21, 50,
;~ return