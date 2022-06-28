$CleanArgs = $args.Split(',').Trim()
$FileObject = (Get-ChildItem $CleanArgs)
$CSVFile = Import-CSV $CleanArgs
$fileName = $FileObject.Name.ToString().replace(".csv", "").replace("_F","_node")
$Headers= ($CSVFile | Get-Member -MemberType 'NoteProperty' | Select-Object -ExpandProperty 'Name')
$Data = $Headers | ForEach-Object {Write-Output "$(($CSVFile | Select-Object -ExpandProperty $_) -Join ',')"}

For ($i = 0; $i -lt $Headers.Count; $i++) 
{
	# $OutputFile = "$($FileObject.DirectoryName)\$fileName\$($Headers[$i]).js"
	$OutputFile = "$($FileObject.DirectoryName)\$fileName.js"
	$JSTemplate = (Get-Content .\JSTemplate)
	$JSTemplate -Replace "@@@", "$($Data[$i])" -Replace "string","$($Headers[$i])" | Out-File -FilePath $OutputFile -Encoding "ASCII" -Append
}
$RemoveT3 = (Get-Content ".\$fileName.js") 
$RemoveT3 -Replace "export var P1_Input_T3.*|export var P2_Input_T3.*" , "" | Out-File -FilePath $OutputFile -Encoding "ASCII"
