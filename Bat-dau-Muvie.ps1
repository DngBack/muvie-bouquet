$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
$runtime=Join-Path $PSScriptRoot '../.work_dm/node-fast/node-v22.16.0-win-x64/node.exe'
if(-not (Test-Path -LiteralPath $runtime)) { $runtime=(Get-Command node -ErrorAction Stop).Source }
$env:HOST='0.0.0.0'
$env:PORT='4173'
& $runtime local/server.mjs
