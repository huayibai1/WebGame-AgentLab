Set-Location -LiteralPath $PSScriptRoot

$projectPath = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$nextBin = Join-Path $projectPath "node_modules\.bin\next.cmd"
$logPath = Join-Path $projectPath ".next-dev.out.log"
$url = "http://127.0.0.1:3000/"

function Test-PreviewReady {
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

if (Test-Path -LiteralPath $nextBin) {
  if (Test-PreviewReady) {
    Write-Host "GameVerse AI preview is already running."
    Write-Host "URL: $url"
    Write-Host "This window will stay open and show server logs."
    Write-Host "Verification codes appear below after registration."
    Write-Host "Press Ctrl+C to stop watching logs."
    Start-Process $url

    if (Test-Path -LiteralPath $logPath) {
      Get-Content -LiteralPath $logPath -Tail 80 -Wait -Encoding UTF8
    } else {
      Write-Host "Log file is not ready yet: $logPath"
      Write-Host "Keep this window open, then register again after the server responds."
      while ($true) { Start-Sleep -Seconds 5 }
    }
  }

  Write-Host "Starting GameVerse AI Next preview..."
  Write-Host "URL: $url"
  Write-Host "Keep this window open. Verification codes appear here after registration."
  Start-Process $url
  npm.cmd run dev -- -H 127.0.0.1 -p 3000
} else {
  Write-Host "Next dependencies are not installed. Falling back to static preview..."
  Write-Host "URL: http://localhost:5173/"
  Start-Process "http://localhost:5173/"
  node .\scripts\local-preview-server.js
}
