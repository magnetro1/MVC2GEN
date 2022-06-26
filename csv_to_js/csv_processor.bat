@echo off
for %%f in (%*) do (
  java -jar csv_processor.jar %%f
)

pause
