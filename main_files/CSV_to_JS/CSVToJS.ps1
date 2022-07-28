# Set up CSV & file names
$CleanArgs = $args.Split(',').Trim()
$CSVFile = Import-CSV $CleanArgs
$FileObject = (Get-ChildItem $CleanArgs)
$fileName = $FileObject.Name.ToString().replace(".csv", "").replace("_F", "_node")
# Set up the path and file name for the output file
$CSV_to_JSPath = Split-Path -Path $MyInvocation.MyCommand.Path -Parent # $MyInvocation returns the path and name of the script
$main_Files = Split-Path -Path $CSV_to_JSPath -Parent # The output directory of the Node.js file 
$OutputPathAndFile = "$main_Files\$filename.js"
# Write the Node.js file 
$Headers = ($CSVFile | Get-Member -MemberType 'NoteProperty' | Select-Object -ExpandProperty 'Name')
$Data = $Headers | ForEach-Object { Write-Output "$(($CSVFile | Select-Object -ExpandProperty $_) -Join ',')" }
For ($i = 0; $i -lt $Headers.Count; $i++) {
	$JSTemplate = (Get-Content .\JSTemplate)
	$JSTemplate -Replace "@@@", "$($Data[$i])" -Replace "string", "$($Headers[$i])" | Out-File -FilePath $OutputPathAndFile -Encoding "ASCII" -Append
}
# Remove the string-version of the inputs from the file
$RemoveT3 = (Get-Content $OutputPathAndFile) 
$RemoveT3 -Replace "export var P1_Input_T3.*|export var P2_Input_T3.*" , "" | Out-File -FilePath $OutputPathAndFile -Encoding "ASCII"
# Write-Host $OutputPathAndFile
# Wait-Event -Timeout 60