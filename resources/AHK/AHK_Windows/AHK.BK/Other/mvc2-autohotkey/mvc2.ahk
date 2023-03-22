#Include XInput.ahk

#Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input

recorded_lp := []
recorded_hp := []
recorded_a1 := []
recorded_lk := []
recorded_hk := []
recorded_a2 := []
recorded_u := []
recorded_d := []
recorded_l := []
recorded_r := []

u_button := 1
d_button := 2
l_button := 4
r_button := 8

lp_button := 16384
hp_button := 32768
a1_button := 512

lk_button := 4096
hk_button := 8192
a2_button := "RT" ; right trigger? axis?

record_button := "LT" ; axis? left trigger
play_button := 256

repeat := 0



_XInput_hm := 0 ; to get xinput to stop warning for no reason
XInput_Init()

IsPressed(joystate, button)
{
	buttons := joystate.wButtons
	
	if(button = "RT")
	{
		rt_state := joystate.bRightTrigger
		
		if(rt_state > 129)
		{
			return true
		}
		return false
	}
	
	if(button = "LT")
	{
		lt_state := joystate.bLeftTrigger
		
		if(lt_state > 129)
		{
			return true
		}
		return false
	}
	
	if(buttons & button == button)
	{
		return true
	}
	
	return false
}

Record()
{
	global recorded_lp
	global recorded_hp
	global recorded_a1
	global recorded_lk
	global recorded_hk
	global recorded_a2
	global recorded_u
	global recorded_d
	global recorded_l
	global recorded_r
	
	global u_button
	global d_button
	global l_button
	global r_button

	global lp_button
	global hp_button
	global a1_button

	global lk_button
	global hk_button
	global a2_button

	global record_button
	global play_button
	
	recorded_lp := []
	recorded_hp := []
	recorded_a1 := []
	recorded_lk := []
	recorded_hk := []
	recorded_a2 := []
	recorded_u := []
	recorded_d := []
	recorded_l := []
	recorded_r := []
	
	has_record_button_been_released := 0
	
	count := 0
	
	ToolTip Recording!

	Loop {
		joystate := XInput_GetState(0)
		
		recorded_lp.Push(IsPressed(joystate, lp_button))
		recorded_hp.Push(IsPressed(joystate, hp_button))
		recorded_a1.Push(IsPressed(joystate, a1_button))
		
		recorded_lk.Push(IsPressed(joystate, lk_button))
		recorded_hk.Push(IsPressed(joystate, hk_button))
		recorded_a2.Push(IsPressed(joystate, a2_button))
		
		
		recorded_u.Push(IsPressed(joystate, u_button))
		recorded_d.Push(IsPressed(joystate, d_button))
		recorded_l.Push(IsPressed(joystate, l_button))
		recorded_r.Push(IsPressed(joystate, r_button))
		
		count += 1
		
		;lp_press := recorded_lp[count]
		
		;ToolTip %lp_press%
		
		Sleep, 10
		
		if(has_record_button_been_released)
		{
			if(IsPressed(joystate, record_button))
			{
				break
			}
		}
		else
		{
			if(!IsPressed(joystate, record_button))
			{
				has_record_button_been_released := 1
			}
		}
		
		if(IsPressed(joystate, play_button))
		{
			break
		}
	}
	
	ToolTip
}

PlayKey(prev, new, key)
{
	if(prev == new)
	{
		return new
	}
	
	if(new)
	{
		Send {%key% Down}
		return new
	} else {
		Send {%key% Up}
		return new
	}
}

Play()
{
	global repeat
	
	global recorded_lp
	global recorded_hp
	global recorded_a1
	global recorded_lk
	global recorded_hk
	global recorded_a2
	global recorded_u
	global recorded_d
	global recorded_l
	global recorded_r
	
	global u_button
	global d_button
	global l_button
	global r_button

	global lp_button
	global hp_button
	global a1_button

	global lk_button
	global hk_button
	global a2_button

	global record_button
	global play_button
	
	u_state := 0
	d_state := 0
	l_state := 0
	r_state := 0
	
	lp_state := 0
	hp_state := 0
	a1_state := 0
	
	lk_state := 0
	hk_state := 0
	a2_state := 0
	
	count := 1
	
	max_iterations := recorded_lp.MaxIndex()
	
	Loop
	{
		Loop % max_iterations
		{
			u_state := PlayKey(u_state, recorded_u[count], "w")
			d_state := PlayKey(d_state, recorded_d[count], "s")
			l_state := PlayKey(l_state, recorded_l[count], "a")
			r_state := PlayKey(r_state, recorded_r[count], "d")
			
			lp_state := PlayKey(lp_state, recorded_lp[count], "Numpad4")
			hp_state := PlayKey(hp_state, recorded_hp[count], "Numpad5")
			a1_state := PlayKey(a1_state, recorded_a1[count], "Numpad6")
			
			lk_state := PlayKey(lk_state, recorded_lk[count], "Numpad1")
			hk_state := PlayKey(hk_state, recorded_hk[count], "Numpad2")
			a2_state := PlayKey(a2_state, recorded_a2[count], "Numpad3")
			
			;ToolTip "playing" %u_state% %d_state% %l_state% %r_state% %lp_state% %hp_state% %a1_state% %lk_state% %hk_state% %a2_state%
			
			count += 1
			Sleep, 10
		}
		
		if(!repeat)
		{
			break
		}
		count := 1
	}
	
	u_state := PlayKey(u_state, 0, "w")
	d_state := PlayKey(d_state, 0, "s")
	l_state := PlayKey(l_state, 0, "a")
	r_state := PlayKey(r_state, 0, "d")
	
	lp_state := PlayKey(lp_state, 0, "Numpad4")
	hp_state := PlayKey(hp_state, 0, "Numpad5")
	a1_state := PlayKey(a1_state, 0, "Numpad6")
	
	lk_state := PlayKey(lk_state, 0, "Numpad1")
	hk_state := PlayKey(hk_state, 0, "Numpad2")
	a2_state := PlayKey(a2_state, 0, "Numpad3")
}


Main()
{
	global record_button
	global play_button
	started := 0
	
	has_button_been_released := 1

	Loop {
		joystate := XInput_GetState(0)
		if(!started)
		{
			started := 1
			
			buttons := joystate.wButtons
			
			
			if(has_button_been_released && IsPressed(joystate, record_button))
			{
				Record()
				has_button_been_released := 0
			}
			else if(has_button_been_released && IsPressed(joystate, play_button))
			{
				Play()
				has_button_been_released := 0
			} else {
				if(!IsPressed(joystate, record_button) && !IsPressed(joystate, play_button))
				{
					has_button_been_released := 1
				}
				
				; other buttons
				lt_state := joystate.bLeftTrigger
				rt_state := joystate.bRightTrigger
				
				;ToolTip %buttons% ... %lt_state% ... %rt_state% p %has_button_been_released%
			}
			
			
			started := 0
		}
		Sleep, 30
	}
}


Main()



; ctrl alt shift R to toggle repeating
^!+R::
repeat := !repeat
Main()
return









