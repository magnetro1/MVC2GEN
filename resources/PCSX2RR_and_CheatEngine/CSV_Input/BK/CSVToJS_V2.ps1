# Get the path to the input file from the command line.
$CleanArgs = $args.Split(',').Trim()
$FileObject = (Get-ChildItem $CleanArgs)

# Get data from the supplied csv file.
$CSVFile = Import-CSV $CleanArgs
$FileName = $FileObject.Name.ToString().replace(".csv", ".jsx")

# First line of CSVFile is our Headers but Powershell does some lifting for me here.
$Headers = ($CSVFile | Get-Member -MemberType 'NoteProperty' | Select-Object -ExpandProperty 'Name')

# Powershell one-liner to gather and arrange data for us.
$Data = $Headers | ForEach-Object {Write-Output "$(($CSVFile | Select-Object -ExpandProperty $_) -Join ',')"}

# Initialize some vars.
$OutputFile = "$($FileObject.DirectoryName)\$($FileName)"
$OutputString = "{`n"
$shortString = ''

# Format our strings.
For ($i = 0; $i -lt $Headers.Count; $i++) {
    # If we find the special headers then we turn them into quote-wrapped strings.
    If ($Headers[$i] -eq "P1_Input_T3" -or $Headers[$i] -eq "P2_Input_T3") {
        # $Data[$i] = ($Data[$i].Split(",") | ForEach-Object { $(If ($_ -ne "") {"`"$($_)`""} Else {""}) }) -Join ","
        $OutputString += "`"$($Headers[$i])`":`"$($Data[$i])`",`n"
    } Else {
        $OutputString += "`"$($Headers[$i])`":[$($Data[$i])],`n"
    }
}

# Remove the final comma and add curly brace.
$OutputString = $OutputString -Replace ".$", ""
$OutputString += "}"

# Output the thing.
$OutputString | Out-File -FilePath $OutputFile -Encoding "ASCII"
