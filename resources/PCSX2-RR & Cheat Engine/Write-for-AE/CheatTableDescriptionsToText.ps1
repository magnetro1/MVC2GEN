# this will output the descriptions of all the relevant entries in the cheat table after (and including) "total frames"

$WriteForAfterEffects = $true

$InputFile = "pcsx2_entelechy_29.CT"
$OutputFile = "forAfterEffects.txt"

Write-Output $null > $OutputFile

$StartReading = $false

$CheatTable = Get-Content $InputFile
$RelevantCheatTable = @()

ForEach ($Line in $CheatTable) {
    if ($Line.Contains("`"Total")) {
    $StartReading = $true
    }

    if ($StartReading) {
        $RelevantCheatTable += $Line
    }
}

$AllDescriptions = $RelevantCheatTable | Select-String -Pattern "<Description>" -Context 0, 5
$ValidDescriptions = @()

for ($i = 0; $i -lt $AllDescriptions.Count; $i++) {
    $ValidDescriptions += $AllDescriptions[$i].ToString().Where({$_.Contains("<Address>")}) | ForEach-Object {$_.Split('"<')[2]}
}

if ($WriteForAfterEffects) {
    $ValidDescriptions -Replace "\&amp;", "_" `
                       -Replace "\s", "_" `
                       -Replace "\-", "_" `
                       -Replace "\/", "_" `
                       -Replace "\(", "_" `
                       -Replace "\)", "_" `
                       -Replace "\?", "_" ` | Select-Object -Unique | Out-File $OutputFile
} else {
    $ValidDescriptions.Replace("&amp;", "&") | Select-Object -Unique | Out-File $OutputFile
}
