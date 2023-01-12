$CleanArgs = $args.Split(',').Trim()
$FileObject = (Get-ChildItem $CleanArgs)
$CSVFile = Import-CSV $CleanArgs
$fileName = $FileObject.Name.ToString().replace(".csv", "").replace("_F","_ae")
if (!(Test-Path ".\$fileName\")) {
	New-Item -ItemType Directory -Path ".\$fileName\"
}
$Headers= ($CSVFile | Get-Member -MemberType 'NoteProperty' | Select-Object -ExpandProperty 'Name')
$Data 	= $Headers | ForEach-Object {Write-Output "$(($CSVFile | Select-Object -ExpandProperty $_) -Join ',')"}
For ($i = 0; $i -lt $Headers.Count; $i++) 
{
	$OutputFile = "$($FileObject.DirectoryName)\$fileName\$($Headers[$i]).js"
	$JSTemplate = (Get-Content .\JSTemplate)
	$JSTemplate -Replace "@@@", "$($Data[$i])" | Out-File -FilePath $OutputFile -Encoding "ASCII"
}