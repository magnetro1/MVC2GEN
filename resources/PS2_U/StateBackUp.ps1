# Change $statePath directory & $destHead Folder Name
$statePath = "G:\Emulators\PCSX2\pcsx2\sstates\" # !!! Insert path to SaveStates
$replayPath= Split-Path -Path $statePath -Parent # goes up one directory
$destHead  = "$replayPath\StateBk\" # !!! "StateBk" can change name
$states = "$statePath*.00*" #selects state files
$tail = "_pcsx2"
$replay = Get-ItemProperty -Path $replayPath\!*.p2m # !!! Searches for a .p2m file that starts with "!"
$replayName = $replay.name.ToString().Replace("!","").Replace(".p2m","") # cleans replay for folder name
if (!(Test-Path "$destHead$replayName$tail")) {New-Item -ItemType Directory -Path  "$destHead$replayName$tail"}
$dispContent = Get-ChildItem $destHead$replayName$tail | ForEach-Object {Write-host $_}
Write-Host($dispContent) # shows the folder's contents for naming
$getNumber = Read-Host "Type in Number" # asks host to provide number for folder
$Destination = New-Item -ItemType Directory -Path "$destHead$replayName$tail\$replayName`_$getNumber$tail" # separator = `_
if (Test-Path "$destHead$replayname$tail\$Destination") {
Write-Host 'Folder exists!'
Wait-Event -Timeout 2
} else {
Copy-Item -Path $states -Destination $Destination #Copies states
Copy-Item -Path $replay -Destination $Destination #Copies replay file
}