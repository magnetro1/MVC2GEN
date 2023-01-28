# Get the CSV from the BAT file 
$CleanArgs = $args.Split(',').Trim()
$FileObject = (Get-ChildItem $CleanArgs)

# Get data from the supplied CSV file.
$CSVFile = Import-CSV $CleanArgs
$FileName = $FileObject.Name.ToString().replace(".csv", ".jsx")

# First line of CSVFile is our Headers
$Headers = ($CSVFile | Get-Member -MemberType 'NoteProperty' | Select-Object -ExpandProperty 'Name')

# Arrange data
$Data = $Headers | ForEach-Object {
    Write-Output "$(($CSVFile | Select-Object -ExpandProperty $_) -Join ',')"
}


$OutputFile = "$($FileObject.DirectoryName)\$($FileName)"
$OutputString = "{`n"

# Format our strings.
For ($i = 0; $i -lt $Headers.Count; $i++) {
    # If we find the special headers then we turn them into quote-wrapped strings.
    If ($Headers[$i] -eq "P1_Input_T3" -or $Headers[$i] -eq "P2_Input_T3") {
        $OutputString += "`"$($Headers[$i])`":`"$($Data[$i])`",`n"
    }
    Else {
        $OutputString += "`"$($Headers[$i])`":[$($Data[$i])],`n"
    }
}

# Remove the final comma and add curly brace.
$OutputString = $OutputString -Replace ".$", ""
$OutputString += "}"

# Output the thing.
$OutputString | Out-File -FilePath '..\main_files\'$OutputFile -Encoding "ASCII"
