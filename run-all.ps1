# run-all.ps1
# Launch backend and frontend in separate PowerShell windows.
# Run this from the project root: .\run-all.ps1

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pwshPath = Join-Path $PSHOME 'powershell.exe'
if (-not (Test-Path $pwshPath)) {
    $pwshPath = 'powershell.exe'
}

Start-Process -FilePath $pwshPath -ArgumentList '-NoExit', '-Command', "Set-Location -Path '$projectRoot\\Backend'; mvn spring-boot:run" -WorkingDirectory "$projectRoot"
Start-Process -FilePath $pwshPath -ArgumentList '-NoExit', '-Command', "Set-Location -Path '$projectRoot\\Frontend'; npm install; npm run dev" -WorkingDirectory "$projectRoot"

Write-Host 'Started backend and frontend in separate PowerShell windows.'
