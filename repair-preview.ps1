Set-Location -LiteralPath $PSScriptRoot

$projectPath = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$nextCache = Join-Path $projectPath ".next"
$outLog = Join-Path $projectPath ".next-dev.out.log"
$errLog = Join-Path $projectPath ".next-dev.err.log"

$processes = Get-CimInstance Win32_Process | Where-Object {
  $_.Name -in @("node.exe", "cmd.exe") -and
  $_.CommandLine -and
  $_.CommandLine.Contains($projectPath) -and
  (
    $_.CommandLine -like "*next*dev*" -or
    $_.CommandLine -like "*npm*run*dev*"
  )
}

foreach ($process in $processes) {
  Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
}

Remove-Item -LiteralPath $nextCache -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $outLog, $errLog -Force -ErrorAction SilentlyContinue

Write-Host "Preview cache repaired. Starting clean Next preview..."
Start-Process "http://127.0.0.1:3000/"
npm.cmd run dev -- -H 127.0.0.1 -p 3000

