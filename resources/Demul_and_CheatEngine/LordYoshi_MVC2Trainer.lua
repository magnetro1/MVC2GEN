-- Marvel vs Capcom 2 Cheat Engine Trainer Script
-- By Lord_Yoshi
-- Created some time in 2020
-- Used Cheat Engine 6.4, Demul 0.7 alpha 310715, and Marvel vs. Capcom 2 (USA) initially
-- Now switched to Cheat Engine 7.1, Demul 0.7 alpha 111117, and Marvel vs. Capcom 2 (USA)
-- Script version 1.02
-- Features include frame stepping, hitbox overlay, macro recording and playback, input log with frame counts, and many documented addresses
-- Feel free to do whatever you want with this script, but trying to sell it or claiming you created it would be rude.
--------------------------------------  ----------------------------------------
----------                     Table of Contents                      ----------
--------------------------------------  ----------------------------------------
-- 1. Shoutouts
-- 2. Setup
-- 3. Global Variables
-- 3a.  Constants
-- 3b.  Statics
-- 4. Functions
-- 4a.  Simple Memory Functions
-- 4b.  Hitbox Processing Functions
-- 4c.  Pausing Functions
-- 4d.  Macro Functions
-- 4e.  Input Display Functions
-- 4f.  Misc Functions
-- 5. Setup Code
-- 6. The End
--------------------------------------  ----------------------------------------
----------                        Shoutouts                           ----------
--------------------------------------  ----------------------------------------
-- SRK, jedpossum, https://forums.shoryuken.com/t/deconstructing-the-mvc2-dreamcast-cd/159481 for his mostly correct info
-- SRK, Jesuszilla, https://forums.shoryuken.com/t/mvc2-hitbox-viewer-data-tool-for-demul-0-7a310715/176626 for a decent, but messy base to start with that only received one reply in almost five years
-- ComboVid, Dammit, https://combovid.com/?p=3156 for some additional details on hitboxes
-- ZachD, Preppy, http://www.zachd.com/mvc2/ for the massive amount of MvC2 info in general
-- And so much more!
--------------------------------------  ----------------------------------------
----------                          Setup                             ----------
--------------------------------------  ----------------------------------------
-- Download and install Demul 0.7 alpha 111117 (http://demul.emulation64.com/)
-- Download and install Cheat Engine 7.1 (https://www.cheatengine.org/downloads.php) (I downloaded the raw files instead of running setup)
-- Acquire a Marvel vs Capcom 2 USA disk image
-- Use a Demul setup guide to find the missing files and get the emulator running
-- Map the Demul alternative control settings to the keyboard as follows:
-- P1: UP-W, DOWN-S, LEFT-A, RIGHT-D, A-V, B-B, X-Z, Y-X, LTRIG-C, RTRIG-N, START-M
-- P2: UP-T, DOWN-G, LEFT-F, RIGHT-H, A-J, B-K, X-U, Y-I, LTRIG-O, RTRIG-L, START-P
-- Once all preferred Demul settings are changed, run Cheat Engine
-- Using Cheat Engine, attach it to the Demul process, then load the Trainer Script cheat table (*.ct)
-- Run this lua script if prompted to, otherwise go to Table>Show Cheat Table Lua Script and click Execute Script
-- You should see the hitbox overlay and input log appear on the screen after a few seconds
-- If the buttons do not completely appear, the D3DHook has bugged out, so reload both Demul and CE and try again
-- Enjoy!
--------------------------------------  ----------------------------------------
----------                     Global Variables                       ----------
--------------------------------------  ----------------------------------------
----------Constants----------
-- Offsets associated with specific emulator versions. Offsets are arbitrary and can't be found with AoB searches.
kDemulBase07111117 = {
    prgmstr = "demul.exe", -- the emulator base name
    prgmbase = nil, -- the emulator executable base address
    inputstr = "padDemul.dll", -- the emulator input file name
    inputbase = nil, -- the base address of the game input file
    emubase = 0x2C000000, -- the base address of the ROM
    ptrbase = 0x2C000000, -- the base address for the pointers, does not always equal emubase
    hitmask = 0x1FFF, -- bitmask for calculating some active hitbox pointer offsets
    ptrmask = 0xFFFFFF, -- bitmask for calculating object pointer offsets
    emupause = 0xD9B536, -- boolean byte, set to 1 to pause, 0 to resume
    keyboardoffset = {
        Q = 0x37210,
        W = 0x37211,
        E = 0x37212,
        R = 0x37213,
        T = 0x37214,
        Y = 0x37215,
        U = 0x37216,
        I = 0x37217,
        O = 0x37218,
        P = 0x37219,
        A = 0x3721E,
        S = 0x3721F,
        D = 0x37220,
        F = 0x37221,
        G = 0x37222,
        H = 0x37223,
        J = 0x37224,
        K = 0x37225,
        L = 0x37226,
        Z = 0x3722C,
        X = 0x3722D,
        C = 0x3722E,
        V = 0x3722F,
        B = 0x37230,
        N = 0x37231,
        M = 0x37232
    }
}
-- Offsets associated with specific ROM versions. Offsets are arbitrary and can't be found with AoB searches.
DCMvc2BaseUsa = {
    hitboxes = 7, -- number of hitboxes used, there's actually 8 but only a few characters have them in some cases (like Amingo and Psylocke) and they don't have an apparent function
    boxshorts = 4, -- number of values per hitbox, stored as "x offset", "x width min and max (this value times 2 gets the actual width)", "y offset", "y width min and max"
    defaultscreenx = 640, -- base game resolution
    defaultscreeny = 480, -- base game resolution
    framecount = 0x1F9D80, -- 4 byte (unsigned?) integer, total frames drawn in the current scene, resets between scenes
    screenarenax = 0x1F9CD8, -- 4 byte float, center of screen position in arena coords, 320 pixels
    screenarenay = 0x1F9CDC, -- 4 byte float, near bottom screen position in arena coords, 343.4 pixels
    pausemenu = 0x212CA2, -- 1 byte unsigned int, 1 is removed "contoroller", 2 is pause menu
    gameactive = 0x2433C8, -- boolean byte, 1 indicates player game in progress
    inputflagp1a = 0x2681DC, -- 1 byte unsigned int, earliest flag for controller inputs, check input section for each flag value
    inputflagp1b = 0x2681DD, -- 1 byte unsigned int, earliest flag for controller inputs, check input section for each flag value
    inputflagp2a = 0x2681F0, -- 1 byte unsigned int, earliest flag for controller inputs, check input section for each flag value
    inputflagp2b = 0x2681F1, -- 1 byte unsigned int, earliest flag for controller inputs, check input section for each flag value
    hitboxlistp1 = 0x287AEC, -- 4 byte unsigned int, pointer list of currently drawn objects with hitboxes, 1 address for each player
    hitboxlistp2 = 0x287C64, -- 4 byte unsigned int, pointer list of currently drawn objects with hitboxes, 1 address for each player
    hitboxcountp1 = 0x287DDE, -- 1 byte unsigned int, number of currenly drawn objects with hitboxes, 1 address for each player
    hitboxcountp2 = 0x287DDF, -- 1 byte unsigned int, number of currenly drawn objects with hitboxes, 1 address for each player
    frameskiprate = 0x289620, -- 1 byte unsigned int, total number of frames before a frame skip frame, normal is 6, turbo is 4, turbo 2 is 2
    frameskipcount = 0x289621, -- 1 byte unsigned int, counts down each frame, when 0, sets to frame skip rate and advances an extra frame
    objoffset = {
        arenaposx = 0x34, -- 4 byte float, X position in arena, approximately -1245 to 1245
        arenaposy = 0x38, -- 4 byte float, Y position in arena, approximately 0 to 1000
        spritescalex = 0x50, -- 4 byte float, also affects hitboxes
        spritescaley = 0x54, -- 4 byte float, also affects hitboxes
        facingright = 0x110, -- boolean byte, facing left is the default value for hitboxes
        hittableptr = 0x170, -- 4 byte unsigned int, pointer to hitbox data
        hitchoiceptr = 0x1C0 -- 4 byte unsigned int, pointer to current active hitboxes
    },
    totalframes = 0x3496B0 -- 4 byte (unsigned?) integer, total frames drawn since the game started
}
-- Injects code to check if the global frame timer address is being updated, then executes a frame update through lua code.
-- Injects code to inhibit keyboard letter inputs as well (emuinputaaflag).
-- If Array of Byte checks are not found, this script will throw an error but may still work if they were already changed.
kInjectCode = [[
	//Lua call setup
	loadlibrary(luaclient-i386.dll)
	luacall(openLuaServer('CELUASERVER'))
	alloc(functionname,16)
	alloc(functionid,4)
	functionname:
	  db 'FrameUpdate',0
	functionid:
	  dd 0

	alloc(newmem,$1000)

	aobScan(counterinjectpoint,89 91 00 00 00 2C C3 CC CC CC 81 E1 FF FF FF 00)
	label(countercode)
	label(counterreturn)
	label(counterskipfunc)

	aobScan(inputinjectpoint,6A 40 59 F3 A5 5F)
	globalalloc(emuinputaaflag,4) //Use WriteInteger to set flag
	label(inputcode)
	label(inputreturn)
	label(inputflagoff)

	newmem:
	countercode:
	  //Adds the original copy line here
	  mov [ecx+2C000000],edx

	  //Checks if the frame counter is being updated, number matches ROM offset
	  cmp ecx,3496B0
	  jne counterskipfunc

	  push edx
	  push ecx
	  push eax

	  mov ecx,[functionid]
	  test ecx,ecx
	  jne short hasrefid

	  //no reference yet
	  push functionname
	  call CELUA_GetFunctionReferenceFromName  //Basically calls createRef(functionname) and returns the value
	  mov [functionid],eax //store the functionid so it doesn't have to be generated again
	  mov ecx,eax //ecx has the functionid

	hasrefid:
	  push 0 //0 because the gui is touched (use 1 if async)
	  push 0 //address of the parameter list (not used)
	  push 0 //number of parameters
	  push ecx //functionid reference
	  call CELUA_ExecuteFunctionByReference
	  //afterwards EAX will contain the result value of the function

	  pop eax
	  pop ecx
	  pop edx

	counterskipfunc:
	  jmp counterreturn

	inputcode:
	  cmp [emuinputaaflag],0
	  je inputflagoff
	  //Checks if the frame counter is being updated, number matches byte block starting point
	  cmp edi,padDemul.dll+37200
	  je inputreturn
	inputflagoff:
	  push 40
	  pop ecx
	  repe movsd
	  jmp inputreturn

	inputinjectpoint:
	  jmp inputcode
	inputreturn:

	counterinjectpoint:
	  jmp countercode
	  nop
	counterreturn:
]]
kHotkey = { -- uses virtual key numbers
    pause = 189, -- dash/underscore key
    framestep = 187, -- equals sign/plus sign key
    macroidle = VK_7, -- 7/& key
    macroplay = VK_8, -- 8/* key
    macroloop = VK_9, -- 9/( key
    macrorecord = VK_0 -- 0/) key
}
kMacroEnum = { -- enums are user-firendly ways of standardizing function values
    idle = "Idling",
    play = "Playing",
    loop = "Looping",
    record = "Recording"
}

----------Statics----------
d3dobj = createD3DHook() -- directx object that manages the hitbox sprites
debugmode = false -- activate via console, enables a bunch of diagnostic messages, in case something goes wrong
pausenextframe = false -- activate via console or hotkey, indicates a frame step
exedata = kDemulBase07111117 -- emulator constants from above, other emulators/roms might have different address offsets, just copy the template and input the different values, then paste the name here
romdata = DCMvc2BaseUsa -- rom constant selected automatically from above
if (not hotkeyobjects) then
    hotkeyobjects = {}
end -- used for destroying hotkeys on reload
if (not hitboxobjects) then
    hitboxobjects = {}
end -- contains an address-sprite table key-value pair for hitboxes
if (not objecttable) then
    objecttable = {}
end -- a list of all hitbox object memory addresses
if (not textureobjects) then
    textureobjects = {}
end -- stores textures for updating input sprites
if (not inputspriteobjects) then
    inputspriteobjects = {}
end
if (not inputlog) then
    inputlog = {}
end
inputlastwindowy = nil -- stored value to track window resizes since D3DHook font size changes create memory leaks
macrostate = nil -- macro state machine indicator
macroline = 0 -- current line the macro is executing
internalres = 6 -- could also find the changed byte to do this automatically

--------------------------------------  ----------------------------------------
----------                        Functions                           ----------
--------------------------------------  ----------------------------------------

----------Simple Memory Functions----------
function ReadByte(_address)
    local _value = readBytes(_address, 1, false)
    if (debugmode) then
        local _debugmessage =
            string.format("ReadByte; Address: %X, Value: %u, Value(Hex): %X", _address, _value, _value)
        print(_debugmessage)
    end
    return _value
end

function WriteByte(_address, _value)
    writeBytes(_address, _value)
    if (debugmode) then
        local _debugmessage = string.format("WriteByte; Address: %X, Value: %u, Value(Hex): %X", _address, _value,
            _value)
        print(_debugmessage)
    end
end

function ReadShort(_address)
    local _value = bAnd(ReadInteger(_address), 0xFFFF)
    if (debugmode) then
        local _debugmessage = string.format("ReadShort; Address: %X, Value: %u, Value(Hex): %X", _address, _value,
            _value)
        print(_debugmessage)
    end
    return _value
end

function ReadSignedShort(_address)
    local _value = ReadShort(_address)
    local _hexvalue = _value
    if (bAnd(_value, 0x8000) > 0) then
        _value = _value - 65536
    end
    if (debugmode) then
        local _debugmessage = string.format("ReadSignedShort; Address: %X, Value: %d, Value(Hex): %X", _address, _value,
            _hexvalue)
        print(_debugmessage)
    end
    return _value
end

function ReadInteger(_address)
    local _value = readInteger(_address)
    if (debugmode) then
        local _debugmessage = string.format("ReadInteger; Address: %X, Value: %u, Value(Hex): %X", _address, _value,
            _value)
        print(_debugmessage)
    end
    return _value
end

function WriteInteger(_address, _value)
    writeInteger(_address, _value)
    if (debugmode) then
        local _debugmessage = string.format("WriteInteger; Address: %X, Value: %u, Value(Hex): %X", _address, _value,
            _value)
        print(_debugmessage)
    end
end

function GetRomAddr(_offset)
    local _value = exedata.emubase + _offset
    if (debugmode) then
        local _debugmessage = string.format("GetAddr; Offset: %X, Address: %X", _offset, _value)
        print(_debugmessage)
    end
    return _value
end

function GetRomPtrAddr(_address)
    local _value = exedata.ptrbase + bAnd(ReadInteger(_address), exedata.ptrmask)
    if (debugmode) then
        local _debugmessage = string.format("GetRomPtrAddr; Pointer: %X, Pointer Address: %X", _address, _value)
        print(_debugmessage)
    end
    return _value
end

----------Hitbox Processing Functions----------
-- When this function is called, it first checks each player's hitbox object list and adds those addresses to the local list.
-- Then, it hides every hitbox currently made except for the hitboxes associated with the local list. Finally, each value on the
-- local list has hitboxes made if it is new, then updates each hitbox associated with those values.
function ProcessHitboxObjects()
    local _gameactive = ReadByte(GetRomAddr(romdata.gameactive))
    local _currentframelist = {}
    local _bytesinint = 0x4
    if (debugmode) then
        local _debugmessage = string.format("GetHitboxObjects; Game Active: %u", _gameactive)
        print(_debugmessage)
    end
    if (_gameactive == 1 and not ConsoleForm.HitboxDisable.Checked) then
        for i = 1, ReadByte(GetRomAddr(romdata.hitboxcountp1)) do
            table.insert(_currentframelist, GetRomPtrAddr(GetRomAddr(romdata.hitboxlistp1) + _bytesinint * (i - 1)))
        end
        for i = 1, ReadByte(GetRomAddr(romdata.hitboxcountp2)) do
            table.insert(_currentframelist, GetRomPtrAddr(GetRomAddr(romdata.hitboxlistp2) + _bytesinint * (i - 1)))
        end
    end
    d3dobj.beginUpdate()
    for i = 1, #objecttable do
        if (not TableContains(_currentframelist, objecttable[i])) then
            for j = 1, #hitboxobjects[objecttable[i]] do
                hitboxobjects[objecttable[i]][j].Visible = false
            end
        end
    end
    for i = 1, #_currentframelist do
        CreateHitboxGroup(_currentframelist[i])
        UpdateHitboxes(_currentframelist[i], romdata.objoffset)
    end
    d3dobj.endUpdate()
end

function CreateHitboxGroup(_objaddr)
    if (not TableContains(objecttable, _objaddr)) then
        table.insert(objecttable, _objaddr)
        UpdateHitboxObjects(_objaddr, CreateHitboxPicturePack())
    end
end

function CreateHitboxPicturePack()
    local _palette = {0x0000FF, -- red
    0x0000FF, -- red
    0xFF0000, -- blue
    0xFF0000, -- blue
    0xFF0000, -- blue
    0xFF0000, -- blue
    0x00FF00, -- green
    0x00FF00 -- green
    }
    local _pictures = {}
    for i = romdata.hitboxes, 1, -1 do
        _pictures[i] = createPicture()
        local _bmp = _pictures[i].Bitmap
        _bmp.Width = 1
        _bmp.Height = 1
        local _canvas = _bmp.Canvas
        _canvas.setPixel(0, 0, _palette[i])
    end
    return _pictures
end

function UpdateHitboxObjects(_objaddr, _pictures)
    local _alpha = {0.3, -- hitbox 1
    0.3, -- hitbox 2
    0.4, -- hitbox 3
    0.4, -- hitbox 4
    0.4, -- hitbox 5
    0.4, -- hitbox 6
    0.2, -- hitbox 7
    0.2 -- hitbox 8
    }
    local _sprites = {}
    for i = 1, #_pictures do
        local _texture = d3dobj.createTexture(_pictures[i])
        _pictures[i].destroy()
        _sprites[i] = d3dobj.createSprite(_texture)
        _sprites[i].Alphablend = _alpha[i]
    end
    hitboxobjects[_objaddr] = _sprites
end

-- This function is where the functions come together. An object address and specific address offsets are used to find addresses
-- to tables containing hitboxes being rendered and their values. These values are then converted into screen values which are then
-- used to move the hitboxes around to the proper locations.
function UpdateHitboxes(_objaddr, _objofftable)
    local _choiceaddr = GetRomPtrAddr(_objaddr + _objofftable.hitchoiceptr)
    local _tableaddr = GetRomPtrAddr(_objaddr + _objofftable.hittableptr)
    local _idtable = GetHitboxIds(_choiceaddr)
    local _coordtable = {}
    for i = 1, #_idtable do
        _coordtable = GetHitboxData(_tableaddr + _idtable[i])
        MoveHitbox(hitboxobjects[_objaddr][i], _objaddr, _objofftable, _coordtable)
    end
end

-- Returns each hitbox ID offset.
function GetHitboxIds(_choiceaddr)
    local _idtable = {}
    local _bytesinshort = 0x2
    for i = 1, romdata.hitboxes do
        _idtable[i] = ReadShort(_choiceaddr + _bytesinshort * (i - 1)) * romdata.boxshorts * _bytesinshort
        _idtable[i] = bAnd(_idtable[i], exedata.hitmask)
    end
    if (debugmode) then
        local _debugtablelist = ""
        for i = 1, #_idtable do
            _debugtablelist = _debugtablelist .. _idtable[i] .. ", "
        end
        local _debugmessage = string.format("GetHitboxIds; Choice Address: %X, ID Table: ", _choiceaddr) ..
                                  _debugtablelist
        print(_debugmessage)
    end
    return _idtable
end

function GetHitboxData(_hitboxid)
    local _datatable = {}
    local _hitboxcoords = {}
    local _bytesinshort = 0x2
    for i = 1, romdata.boxshorts do
        _datatable[i] = ReadSignedShort(_hitboxid + _bytesinshort * (i - 1))
    end
    if (debugmode) then
        local _debugtablelist = ""
        for i = 1, #_datatable do
            _debugtablelist = _debugtablelist .. _datatable[i] .. ", "
        end
        local _debugmessage = string.format("GetHitboxData; Hitbox ID Address: %X, Data Table: ", _hitboxid) ..
                                  _debugtablelist
        print(_debugmessage)
    end
    _hitboxcoords = ConvertHitboxData(_datatable)
    return _hitboxcoords
end

function ConvertHitboxData(_datatable)
    local _hitboxcoords = {}
    _hitboxcoords.xmin = _datatable[1] - _datatable[2]
    _hitboxcoords.xmax = _datatable[1] + _datatable[2]
    _hitboxcoords.ymin = _datatable[3] - _datatable[4]
    _hitboxcoords.ymax = _datatable[3] + _datatable[4]
    if (debugmode) then
        local _debugmessage = string.format("ConvertHitboxData; xmin: %d, xmax: %d, ymin: %d, ymax: %d",
            _hitboxcoords.xmin, _hitboxcoords.xmax, _hitboxcoords.ymin, _hitboxcoords.ymax)
        print(_debugmessage)
    end
    return _hitboxcoords
end

-- Note for the hitbox scaling, there is an address for the expected scaling multiplier, but for some reason Sentinel's
-- Plasma Storm and Servbot's/Kobun's King Servbot/Kobun incorrectly increases the addresses without actually using them.
-- Therefore, since the constant values are used by everyone, and the sprite scaling works for the other uniquely scaling
-- characters (Abyss, Amingo, Anakaris, SonSon), I decided to use the graphics scale instead.
-- Some versions of demul actually render the frame first and then stretch the frame to fit the screen, ruining the resolution conversion.
function MoveHitbox(_sprite, _objaddr, _objofftable, _hitboxcoords)
    local _coords = {}
    local _hitboxflip = ReadByte(_objaddr + _objofftable.facingright)
    local _screenmultix = 1 -- d3dobj.Width / romdata.defaultscreenx
    local _screenmultiy = 1 -- d3dobj.Height / romdata.defaultscreeny
    local _widthconstant = 1.666667
    local _heightconstant = 2.142857
    local _widthmulti = readFloat(_objaddr + _objofftable.spritescalex) * _widthconstant * _screenmultix * internalres
    local _heightmulti = readFloat(_objaddr + _objofftable.spritescaley) * _heightconstant * _screenmultiy * internalres
    local _screenoffsetx = 320 -- * internalres
    local _screenoffsety = 343.4 -- * internalres
    if (debugmode) then
        local _debugmessage =
            string.format("MoveHitbox; Object Address: %X, Is Facing Right: %u", _objaddr, _hitboxflip)
        print(_debugmessage)
    end
    if (_hitboxcoords.xmin == _hitboxcoords.xmax or _hitboxcoords.ymin == _hitboxcoords.ymax or
        ReadByte(GetRomAddr(romdata.pausemenu)) ~= 0) then
        _sprite.Visible = false
        return
    end
    _coords.x = (readFloat(_objaddr + _objofftable.arenaposx) - readFloat(GetRomAddr(romdata.screenarenax)) +
                    _screenoffsetx) * _screenmultix * internalres
    _coords.y = (readFloat(GetRomAddr(romdata.screenarenay)) - readFloat(_objaddr + _objofftable.arenaposy) +
                    _screenoffsety) * _screenmultiy * internalres
    _coords.xmin = _hitboxcoords.xmin * _widthmulti
    _coords.xmax = _hitboxcoords.xmax * _widthmulti
    _coords.ymin = _hitboxcoords.ymin * _heightmulti
    _coords.ymax = _hitboxcoords.ymax * _heightmulti
    if (_hitboxflip == 1) then
        _coords.xmin = _coords.xmin * -1
        _coords.xmax = _coords.xmax * -1
    end
    _sprite.X = _coords.x + math.min(_coords.xmin, _coords.xmax)
    _sprite.Width = math.abs(_coords.xmin - _coords.xmax)
    _sprite.Y = _coords.y + math.min(_coords.ymin, _coords.ymax)
    _sprite.Height = math.abs(_coords.ymin - _coords.ymax)
    _sprite.Visible = true
    if (debugmode) then
        local _debugmessage = string.format(
            "MoveHitbox; Hitbox X: %.3f, Hitbox X min: %.3f, Hitbox X max: %.3f, Hitbox Y: %.3f, Hitbox Y min: %.3f, Hitbox Y max: %.3f",
            _coords.x, _coords.xmin, _coords.xmax, _coords.y, _coords.ymin, _coords.ymax)
        print(_debugmessage)
    end
end

----------Pausing Functions----------
function PauseToggleHotkey()
    if (ActiveGameWindowCheck()) then
        ToggleCheckBox(ConsoleForm.PauseToggle)
    end
end

function PauseOnToggle(_sender)
    local _value = 0
    if (_sender.Checked) then
        _value = 1
    end
    WriteByte(exedata.prgmbase + exedata.emupause, _value)
end

function PauseNextFrameHotkey()
    if (ActiveGameWindowCheck()) then
        PauseNextFrame()
    end
end

function PauseNextFrame()
    ConsoleForm.PauseToggle.Checked = false
    pausenextframe = true
end

function FrameStepCheck()
    if (pausenextframe) then
        ConsoleForm.PauseToggle.Checked = true
        pausenextframe = false
    end
end

----------Macro Functions----------
function KeyInputDisable(_bool)
    local _value = 0
    if (_bool) then
        _value = 1
    end
    WriteInteger(getAddress("emuinputaaflag"), _value)
end

function MacroSetIdleHotkey()
    if (ActiveGameWindowCheck()) then
        MacroSetIdle()
    end
end

function MacroSetIdle()
    MacroSetState(kMacroEnum.idle)
end

function MacroSetPlayHotkey()
    if (ActiveGameWindowCheck()) then
        MacroSetPlay()
    end
end

function MacroSetPlay()
    MacroSetState(kMacroEnum.play)
end

function MacroSetLoopHotkey()
    if (ActiveGameWindowCheck()) then
        MacroSetLoop()
    end
end

function MacroSetLoop()
    MacroSetState(kMacroEnum.loop)
end

function MacroSetRecordHotkey()
    if (ActiveGameWindowCheck()) then
        MacroSetRecord()
    end
end

function MacroSetRecord()
    MacroSetState(kMacroEnum.record)
end

function MacroSetState(_kMacroEnum)
    if (macrostate == _kMacroEnum) then
        return
    end
    local _macrolinestart = tonumber(ConsoleForm.MacroEditLineStart.Text) or 1
    macroline = _macrolinestart
    macrostate = _kMacroEnum
    MacroStatus()
    ConsoleForm.MacroState.Caption = string.format("Current state:  %s", macrostate)
end

function MacroUpdate()
    if (macrostate == kMacroEnum.idle) then
        MacroIdle()
    elseif (macrostate == kMacroEnum.record) then
        MacroRecord()
    else
        MacroRun()
    end
end

function MacroIdle()
    KeyInputDisable(false)
end

function MacroRecord()
    local _fsrate = ReadByte(GetRomAddr(romdata.frameskiprate))
    local _fscount = ReadByte(GetRomAddr(romdata.frameskipcount))
    if (macroline == 1 and ConsoleForm.MacroFrameToggle.Checked and _fsrate ~= _fscount) then
        return
    end
    local _recordstringp1 = MacroGetCurrentLog(romdata.inputflagp1a, romdata.inputflagp1b, ConsoleForm.MacroEditKeyP1)
    local _recordstringp2 = MacroGetCurrentLog(romdata.inputflagp2a, romdata.inputflagp2b, ConsoleForm.MacroEditKeyP2)
    ConsoleForm.MacroBoxP1.Items.Add(_recordstringp1)
    ConsoleForm.MacroBoxP2.Items.Add(_recordstringp2)
    macroline = macroline + 1
    MacroBoxSelectEnd(ConsoleForm.MacroBoxP1)
    MacroBoxSelectEnd(ConsoleForm.MacroBoxP2)
    MacroStatus()
end

function MacroBoxSelectEnd(_macrobox)
    _macrobox.ItemIndex = _macrobox.Items.Count - 1
end

-- Edit box key string must be in the following format to successfully record inputs:
-- Up Down Left Right X(LP) Y(HP) L(A1) A(LK) B(HK) R(A2) Start BlankCharacter
-- Example: "WSADZXCVBNM." for suggested player 1 controls, assign them to the alternative controls in demul's options.
function MacroGetCurrentLog(_flagoffseta, _flagoffsetb, _editboxkey)
    local _bytea = ReadByte(GetRomAddr(_flagoffseta))
    local _byteb = ReadByte(GetRomAddr(_flagoffsetb))
    local _keystring = _editboxkey.Text
    if (string.len(_keystring) < 12) then
        return ""
    end
    local _inputstring = ""
    if (bAnd(_byteb, 32) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 1, 1) -- Up
    elseif (bAnd(_byteb, 16) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 2, 2) -- Down
    end
    if (bAnd(_byteb, 8) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 3, 3) -- Left
    elseif (bAnd(_byteb, 4) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 4, 4) -- Right
    end
    if (bAnd(_byteb, 2) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 5, 5)
    end -- X
    if (bAnd(_byteb, 1) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 6, 6)
    end -- Y
    if (bAnd(_bytea, 128) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 7, 7)
    end -- L
    if (bAnd(_bytea, 64) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 8, 8)
    end -- A
    if (bAnd(_bytea, 32) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 9, 9)
    end -- B
    if (bAnd(_bytea, 16) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 10, 10)
    end -- R
    if (bAnd(_byteb, 128) > 0) then
        _inputstring = _inputstring .. string.sub(_keystring, 11, 11)
    end -- Start
    if (string.len(_inputstring) < 1) then
        _inputstring = _inputstring .. string.sub(_keystring, 12, 12)
    end -- Blank character
    return _inputstring
end

function MacroRun()
    local _fsrate = ReadByte(GetRomAddr(romdata.frameskiprate))
    local _fscount = ReadByte(GetRomAddr(romdata.frameskipcount))
    KeyInputDisable(true)
    if (macroline == 1 and ConsoleForm.MacroFrameToggle.Checked and _fsrate ~= _fscount) then
        return
    end
    MacroClearLetters()
    MacroInputLetters(ConsoleForm.MacroBoxP1)
    MacroInputLetters(ConsoleForm.MacroBoxP2)
    macroline = macroline + 1
    MacroBoxSelectCurrent(ConsoleForm.MacroBoxP1)
    MacroBoxSelectCurrent(ConsoleForm.MacroBoxP2)
    MacroStatus()
    if (macroline > ConsoleForm.MacroBoxP1.Items.Count and macroline > ConsoleForm.MacroBoxP2.Items.Count) then
        macroline = 1
        if (macrostate == kMacroEnum.play or
            (ConsoleForm.MacroBoxP1.Items.Count == 0 and ConsoleForm.MacroBoxP2.Items.Count == 0)) then
            MacroSetIdle()
        end
    end
end

function MacroClearLetters()
    local _depressbyte = 0x00
    for _, _offset in pairs(exedata.keyboardoffset) do
        WriteByte(exedata.inputbase + _offset, _depressbyte)
    end
end

function MacroInputLetters(_listbox)
    if (macroline > _listbox.Items.Count or macroline < 1) then
        return
    end
    local _pressbyte = 0x80
    local _string = string.match(_listbox.Items[macroline - 1], "%u+") or ""
    for i = 1, string.len(_string) do
        local _offset = exedata.keyboardoffset[string.sub(_string, i, i)]
        if (_offset) then
            WriteByte(exedata.inputbase + _offset, _pressbyte)
        end
    end
end

function MacroBoxSelectCurrent(_macrobox)
    local _currentline = macroline
    local _itemcount = _macrobox.Items.Count
    if (_currentline > _itemcount) then
        _currentline = _itemcount
    end
    _macrobox.ItemIndex = _currentline - 1
end

function MacroBoxAdd()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    local _editbox = ConsoleForm.MacroEdit
    _listbox.Items.Add(_editbox.Text)
    _editbox.setFocus()
    MacroStatus()
end

function MacroBoxInsert()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    local _editbox = ConsoleForm.MacroEdit
    _listbox.Items.Insert(_listbox.ItemIndex, _editbox.Text)
    _editbox.setFocus()
    MacroStatus()
end

function MacroBoxReplace()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    local _editbox = ConsoleForm.MacroEdit
    _listbox.Items[_listbox.ItemIndex] = _editbox.Text
    _editbox.setFocus()
    MacroStatus()
end

function MacroBoxDelete()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    local _selected = _listbox.ItemIndex
    _listbox.Items.Delete(_selected)
    if (_selected == _listbox.Items.Count) then
        _selected = _selected - 1
    end
    _listbox.ItemIndex = _selected
    ConsoleForm.MacroEdit.setFocus()
    MacroStatus()
end

function MacroBoxClear()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    _listbox.Items.Clear()
    ConsoleForm.MacroEdit.setFocus()
    MacroStatus()
end

function MacroBoxLoad()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    local _opendialog = createOpenDialog()
    _opendialog.Title = "Open macro..."
    _opendialog.DefaultExt = ".txt"
    _opendialog.Filter = "Filename (*.txt)|*.txt"
    _opendialog.Options = "ofOverwritePrompt, ofCreatePrompt"
    if _opendialog.execute() then
        local _macrofile = io.open(_opendialog.FileName, "r")
        MacroBoxClear()
        for _line in _macrofile:lines() do
            _listbox.Items.Add(_line)
        end
        _macrofile:close()
    end
    _opendialog.destroy()
    MacroStatus()
end

function MacroBoxSave()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    local _savedialog = createSaveDialog()
    _savedialog.Title = "Save current macro..."
    _savedialog.DefaultExt = ".txt"
    _savedialog.Filter = "Filename (*.txt)|*.txt"
    _savedialog.Options = "ofOverwritePrompt, ofCreatePrompt"
    if _savedialog.execute() then
        local _macrofile = io.open(_savedialog.FileName, "w")
        for i = 1, _listbox.Items.Count - 1 do
            _macrofile:write(_listbox.Items[i - 1], "\n")
        end
        if (_listbox.Items.Count > 0) then
            _macrofile:write(_listbox.Items[_listbox.Items.Count - 1])
        end
        _macrofile:close()
    end
    _savedialog.destroy()
end

function MacroStatus()
    local _listbox = ConsoleForm.MacroBoxP1
    if (ConsoleForm.MacroEnableSecondBox.Checked) then
        _listbox = ConsoleForm.MacroBoxP2
    end
    ConsoleForm.MacroStatus.Caption = string.format("Sel line: %d, Total: %d, %s, Macro line: %d",
        _listbox.ItemIndex + 1, _listbox.Items.Count, _listbox.Name, macroline)
end

function MacroBoxClick(_listbox)
    if (_listbox == ConsoleForm.MacroBoxP1) then
        ConsoleForm.MacroEnableSecondBox.Checked = false
    else
        ConsoleForm.MacroEnableSecondBox.Checked = true
    end
    MacroStatus()
end

----------Input Display Functions----------
function InputDisplaySetup()
    InputCreateGraphics()
    InputSetupLogSystem()
end

function InputCreateGraphics()
    local _graphiclist = {"ArrowNeutral", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUpLeft",
                          "ArrowUpRight", "ArrowDownLeft", "ArrowDownRight", "Buttons4Blank", "ButtonsA", "ButtonsB",
                          "ButtonsX", "ButtonsY", "ButtonsAB", "ButtonsAX", "ButtonsAY", "ButtonsBX", "ButtonsBY",
                          "ButtonsXY", "ButtonsABX", "ButtonsABY", "ButtonsAXY", "ButtonsBXY", "ButtonsABXY",
                          "Buttons3Blank", "ButtonsL", "ButtonsR", "ButtonsS", "ButtonsLR", "ButtonsLS", "ButtonsRS",
                          "ButtonsLRS"}
    for _address, _object in pairs(textureobjects) do
        _object.destroy()
        _object = nil
    end
    for i = 1, #_graphiclist do
        local _filename = _graphiclist[i] .. ".png"
        textureobjects[_graphiclist[i]] = InputLoadTexture(_filename)
    end
    textureobjects.InputFont = InputCreateFont()
    textureobjects.InputFontMap = d3dobj.createFontmap(textureobjects.InputFont)
end

function InputLoadTexture(_filename)
    local _picture = createPicture()
    local _image = findTableFile(_filename)
    _picture.loadFromStream(_image.Stream)
    sleep(30)
    local _texture = d3dobj.createTexture(_picture)
    _picture.destroy()
    return _texture
end

function InputCreateFont()
    local _font = createFont()
    local _textsize = 20
    local _screenmultiy = d3dobj.Height / romdata.defaultscreeny
    _font.Height = math.floor(_textsize * _screenmultiy + 0.5)
    _font.Color = 0xFFFFFF
    _font.Quality = "fqNonAntialiased"
    return _font
end

function InputSetupLogSystem()
    local _players = 2
    local _displayrows = 25 * _players
    InputCreateSprites(_displayrows)
    InputCreateLog(_displayrows)
end

function InputCreateSprites(_rows)
    for i = 1, #inputspriteobjects do
        for j = 1, #inputspriteobjects[i] do
            inputspriteobjects[i][j].destroy()
            inputspriteobjects[i][j] = nil
        end
        inputspriteobjects[i] = nil
    end
    for i = 1, _rows do
        local _spriteset = {}
        _spriteset[1] = d3dobj.createSprite(textureobjects.ArrowNeutral) -- pad direction
        _spriteset[2] = d3dobj.createSprite(textureobjects.ArrowNeutral) -- ABXY buttons
        _spriteset[3] = d3dobj.createSprite(textureobjects.ArrowNeutral) -- LR and Start
        _spriteset[4] = d3dobj.createTextContainer(textureobjects.InputFontMap, 0, 0, "") -- frames input held
        inputspriteobjects[i] = _spriteset
    end
end

function InputCreateLog(_rows)
    for i = 1, #inputlog do
        for j = 1, #inputlog[i] do
            inputlog[i][j] = nil
        end
        inputlog[i] = nil
    end
    for i = 1, _rows do
        local _textureset = {}
        _textureset[1] = textureobjects.ArrowNeutral
        _textureset[2] = textureobjects.ArrowNeutral
        _textureset[3] = textureobjects.ArrowNeutral
        _textureset[4] = ""
        inputlog[i] = _textureset
    end
end

function InputUpdateSprites()
    if (ConsoleForm.InputLogDisable.Checked) then
        return
    end
    d3dobj.beginUpdate()
    InputLogUpdate()
    InputChangeTextures()
    InputResizeSprites()
    InputMoveSprites()
    d3dobj.endUpdate()
end

function InputLogUpdate()
    local _logrowp1 = InputGetCurrentLog(romdata.inputflagp1a, romdata.inputflagp1b)
    local _logrowp2 = InputGetCurrentLog(romdata.inputflagp2a, romdata.inputflagp2b)
    InputRowTest(1, _logrowp1)
    InputRowTest(1 + #inputlog / 2, _logrowp2)
end

function InputGetCurrentLog(_flagoffseta, _flagoffsetb)
    local _bytea = ReadByte(GetRomAddr(_flagoffseta))
    local _byteb = ReadByte(GetRomAddr(_flagoffsetb))
    local _arrow = "Arrow"
    local _4buttons = "Buttons"
    local _3buttons = "Buttons"
    if (bAnd(_byteb, 60) == 0) then
        _arrow = _arrow .. "Neutral"
    else
        if (bAnd(_byteb, 32) > 0) then
            _arrow = _arrow .. "Up"
        elseif (bAnd(_byteb, 16) > 0) then
            _arrow = _arrow .. "Down"
        end
        if (bAnd(_byteb, 8) > 0) then
            _arrow = _arrow .. "Left"
        elseif (bAnd(_byteb, 4) > 0) then
            _arrow = _arrow .. "Right"
        end
    end
    if (bAnd(_bytea, 96) == 0 and bAnd(_byteb, 3) == 0) then
        _4buttons = _4buttons .. "4Blank"
    else
        if (bAnd(_bytea, 64) > 0) then
            _4buttons = _4buttons .. "A"
        end
        if (bAnd(_bytea, 32) > 0) then
            _4buttons = _4buttons .. "B"
        end
        if (bAnd(_byteb, 2) > 0) then
            _4buttons = _4buttons .. "X"
        end
        if (bAnd(_byteb, 1) > 0) then
            _4buttons = _4buttons .. "Y"
        end
    end
    if (bAnd(_bytea, 144) == 0 and bAnd(_byteb, 128) == 0) then
        _3buttons = _3buttons .. "3Blank"
    else
        if (bAnd(_bytea, 128) > 0) then
            _3buttons = _3buttons .. "L"
        end
        if (bAnd(_bytea, 16) > 0) then
            _3buttons = _3buttons .. "R"
        end
        if (bAnd(_byteb, 128) > 0) then
            _3buttons = _3buttons .. "S"
        end
    end
    local _logrow = {textureobjects[_arrow], textureobjects[_4buttons], textureobjects[_3buttons], 1}
    return _logrow
end

function InputRowTest(_rowint, _newrowarr)
    local _endrow = _rowint - 1 + #inputlog / 2
    local _framemax = 999
    if (InputCompareRows(inputlog[_rowint], _newrowarr)) then
        inputlog[_rowint][4] = inputlog[_rowint][4] + 1
        if (inputlog[_rowint][4] > _framemax) then
            inputlog[_rowint][4] = _framemax
        end
    else
        for i = 1, #inputlog[_endrow] do
            inputlog[_endrow][i] = nil
        end
        for i = _endrow, _rowint + 1, -1 do
            inputlog[i] = inputlog[i - 1]
        end
        inputlog[_rowint] = _newrowarr
    end
end

function InputCompareRows(_oldrow, _newrow)
    if (_oldrow[1] == _newrow[1] and _oldrow[2] == _newrow[2] and _oldrow[3] == _newrow[3]) then
        return true
    end
    return false
end

function InputChangeTextures()
    for i = 1, #inputlog do
        for j = 1, 3 do
            if (inputspriteobjects[i][j].Texture ~= inputlog[i][j]) then
                inputspriteobjects[i][j].Texture = inputlog[i][j]
            end
        end
        inputspriteobjects[i][4].Text = tostring(inputlog[i][4])
    end
end

function InputResizeSprites()
    local _iconsize = 16
    local _screenmultix = d3dobj.Width / romdata.defaultscreenx
    local _screenmultiy = d3dobj.Height / romdata.defaultscreeny
    local _iconwidth = _iconsize * _screenmultix
    local _iconheight = _iconsize * _screenmultiy
    for i = 1, #inputspriteobjects do
        for j = 1, 3 do
            inputspriteobjects[i][j].Width = _iconwidth
            inputspriteobjects[i][j].Height = _iconheight
        end
    end
    if (inputlastwindowy ~= d3dobj.Height) then
        inputlastwindowy = d3dobj.Height
        InputUpdateFontMap()
    end
end

function InputUpdateFontMap()
    local _screenmultiy = d3dobj.Height / romdata.defaultscreeny
    local _textsize = 20
    textureobjects.InputFont.Height = math.floor(_textsize * _screenmultiy + 0.5)
    textureobjects.InputFontMap.changeFont(textureobjects.InputFont) -- leaks memory
end

function InputMoveSprites()
    local _iconsize = 16
    local _screenmultix = d3dobj.Width / romdata.defaultscreenx
    local _screenmultiy = d3dobj.Height / romdata.defaultscreeny
    local _iconwidth = _iconsize * _screenmultix
    local _iconheight = (_iconsize + 1) * _screenmultiy
    local _xborderoffset = 20 * _screenmultix
    local _yborderoffset = 145 * _screenmultiy
    for i = 1, #inputspriteobjects / 2 do
        for j = 1, #inputspriteobjects[i] do
            inputspriteobjects[i][j].X = _xborderoffset + _iconwidth * (j - 1)
            inputspriteobjects[i][j].Y = _yborderoffset + _iconheight * (i - 1)
        end
    end
    for i = #inputspriteobjects / 2 + 1, #inputspriteobjects do
        for j = 1, #inputspriteobjects[i] do
            inputspriteobjects[i][j].X = d3dobj.Width - _xborderoffset - _iconwidth * (#inputspriteobjects[i] - 11 - j)
            inputspriteobjects[i][j].Y = _yborderoffset + _iconheight * (i - 1 - #inputspriteobjects / 2)
        end
    end
end

function InputLogDisable(_checkbox)
    for i = 1, #inputspriteobjects do
        for j = 1, #inputspriteobjects[i] do
            inputspriteobjects[i][j].Visible = not _checkbox.Checked
        end
    end
end

----------Misc Functions----------
function AssignAddresses()
    exedata.prgmbase = getAddress(exedata.prgmstr)
    exedata.inputbase = getAddress(exedata.inputstr)
end

function CreateHotkeys()
    for i = 1, #hotkeyobjects do
        hotkeyobjects[i].destroy()
        hotkeyobjects[i] = nil
    end
    table.insert(hotkeyobjects, createHotkey("PauseToggleHotkey", kHotkey.pause))
    table.insert(hotkeyobjects, createHotkey("PauseNextFrameHotkey", kHotkey.framestep))
    table.insert(hotkeyobjects, createHotkey("MacroSetIdleHotkey", kHotkey.macroidle))
    table.insert(hotkeyobjects, createHotkey("MacroSetPlayHotkey", kHotkey.macroplay))
    table.insert(hotkeyobjects, createHotkey("MacroSetLoopHotkey", kHotkey.macroloop))
    table.insert(hotkeyobjects, createHotkey("MacroSetRecordHotkey", kHotkey.macrorecord))
end

-- This function executes any function that does something on every frame.
function FrameUpdate()
    if (debugmode) then
        return
    end
    MacroUpdate()
    ProcessHitboxObjects()
    InputUpdateSprites()
    FrameStepCheck()
end

function ToggleCheckBox(_checkbox)
    _checkbox.Checked = not _checkbox.Checked
end

function DebugOnToggle(_sender)
    debugmode = _sender.Checked
end

function ActiveGameWindowCheck()
    if (getForegroundProcess() == getOpenedProcessID()) then
        return true
    else
        return false
    end
end

function TableContains(_table, _value)
    local _isfound = false
    _table = _table
    for i = 1, #_table do
        if _table[i] == _value then
            _isfound = true
            break
        end
    end
    if (debugmode) then
        local _debugmessage = string.format("TableContains; Value: %u, Found: %s", _value, tostring(_isfound))
        print(_debugmessage)
    end
    return _isfound
end

--------------------------------------  ----------------------------------------
----------                        Setup Code                          ----------
--------------------------------------  ----------------------------------------

AssignAddresses()
CreateHotkeys()
MacroSetIdle()
MacroStatus()
InputDisplaySetup()
if (not autoAssemble(kInjectCode)) then
    print("Counter injection script failed.")
end

--------------------------------------  ----------------------------------------
----------                          The End                           ----------
--------------------------------------  ----------------------------------------

-- Thanks for using this script!
