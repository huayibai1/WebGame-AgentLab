Set-Location -LiteralPath $PSScriptRoot

$projectPath = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$nextBin = Join-Path $projectPath "node_modules\.bin\next.cmd"
$port = 3000
$localUrl = "http://127.0.0.1:$port/"

function Get-RadminAddresses {
  $addresses = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {
    $_.IPAddress -like "26.*" -and
    $_.PrefixOrigin -ne "WellKnown" -and
    $_.IPAddress -ne "127.0.0.1"
  }

  return $addresses | Select-Object -ExpandProperty IPAddress -Unique
}

function Test-PortReady {
  param([string] $Url)

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

function Show-AccessInfo {
  $radminAddresses = @(Get-RadminAddresses)

  Write-Host ""
  Write-Host "GameVerse AI Radmin VPN preview"
  Write-Host "Local URL:  $localUrl"

  if ($radminAddresses.Count -gt 0) {
    Write-Host ""
    Write-Host "Send one of these URLs to Radmin VPN members:"
    foreach ($address in $radminAddresses) {
      Write-Host "  http://$address`:$port/"
    }
  } else {
    Write-Host ""
    Write-Host "No Radmin-style 26.x IPv4 address was detected."
    Write-Host "Open Radmin VPN, copy your IPv4 address, then use:"
    Write-Host "  http://YOUR_RADMIN_IP:$port/"
  }

  Write-Host ""
  Write-Host "Keep this window open. Verification codes and server logs appear here."
  Write-Host "When another Radmin VPN member registers, their verification code also appears in this window."
  Write-Host "If other computers cannot open the URL, allow Node.js or TCP port $port in Windows Firewall."
  Write-Host ""
}

if (-not (Test-Path -LiteralPath $nextBin)) {
  Write-Host "Next dependencies are not installed. Run npm install first."
  Read-Host "Press Enter to close"
  exit 1
}

if (Test-PortReady -Url $localUrl) {
  Show-AccessInfo
  Start-Process $localUrl
  Write-Host "A preview server is already running on port $port."
  Write-Host "If it was started by start-preview.bat, it may only listen on 127.0.0.1."
  Write-Host "Close the old preview window or run repair-preview.bat, then start this script again."
  Read-Host "Press Enter to close"
  exit 0
}

Show-AccessInfo
Start-Process $localUrl
npm.cmd run dev -- -H 0.0.0.0 -p $port
