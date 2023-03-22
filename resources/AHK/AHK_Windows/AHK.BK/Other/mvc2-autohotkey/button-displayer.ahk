#Include XInput.ahk

#Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input

_XInput_hm := 0 ; to get xinput to stop warning for no reason
XInput_Init()

Loop {
	joystate := XInput_GetState(0)
	
	buttons := joystate.wButtons
	
	; other buttons
	lt_state := joystate.bLeftTrigger
	rt_state := joystate.bRightTrigger
	
	ToolTip %buttons% ... LT: %lt_state% ... RT: %rt_state%
}