@rem echo # {date} {time} >> ffmlist.txt
@nofilenamequoting
@nodeselect
@filesonly 
del ffmlist.txt
echo file '{filepath$}' >> ffmlist.txt
@nodeselect 
@firstfileonly
C:\ffmpeg\bin\ffmpeg.exe -f concat -safe 0 -i ffmlist.txt -c copy "{filepath$|noext}.all{filepath$|ext}"


@rem echo # "C:\ffmpeg\bin\ffmpeg.exe" -f concat -safe 0 -i ffmlist.txt -c copy "{filepath$|noext}.all{filepath$|ext}" >> ffmlist.txt
@rem @filesonly
@rem echo # file '{filepath$}' >> ffmlist.txt
@rem pause
