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
#Include WinClipAPI.ahk
#Include WinClip.ahk
wc := new WinClip
return
}

; Copies image data from file to the clipboard.
ImageToClipboard(Filename)
{
    hbm := DllCall("LoadImage","uint",0,"str",Filename,"uint",0,"int",0,"int",0,"uint",0x10)
    if !hbm
        return
    DllCall("OpenClipboard","uint",0)
    DllCall("EmptyClipboard")
    ; Place the data on the clipboard. CF_BITMAP=0x2
    if ! DllCall("SetClipboardData","uint",0x2,"uint",hbm)
        DllCall("DeleteObject","uint",hbm)
    DllCall("CloseClipboard")
}

Numpad1::
ImagetoClipboard("G:\\Colors.bmp")
Send, ^v  
return

Numpad2::
WinClip.Clear()
WinClip.SetBitmap("G:\sanik.png")
WinClip.Paste()
return