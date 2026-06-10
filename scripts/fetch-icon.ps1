# Скачать SVG через icons0 MCP API (нужен ICONS0_API_KEY)
# Пример: .\fetch-icon.ps1 lucide:braces json-decoder
param(
  [Parameter(Mandatory)][string]$IconId,
  [Parameter(Mandatory)][string]$OutName
)

if (-not $env:ICONS0_API_KEY) {
  Write-Error "Задайте ICONS0_API_KEY"
  exit 1
}

$body = @{ name = $IconId; format = "svg"; size = 24 } | ConvertTo-Json
$headers = @{
  Authorization = "Bearer $($env:ICONS0_API_KEY)"
  "Content-Type" = "application/json"
}

$res = Invoke-RestMethod -Uri "https://icons0.dev/mcp" -Method Post -Headers $headers -Body $body 2>$null
if (-not $res) {
  Write-Host "MCP REST failed, fallback Iconify..."
  $path = $IconId -replace ":", "/"
  $url = "https://api.iconify.design/$path.svg?color=%23FF5A1F"
  $outDir = Join-Path $PSScriptRoot "..\icons"
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  curl.exe -sL $url -o (Join-Path $outDir "$OutName.svg")
  exit 0
}

# Fallback Iconify if direct API shape differs
$path = $IconId -replace ":", "/"
$url = "https://api.iconify.design/$path.svg?color=%23FF5A1F"
$outDir = Join-Path $PSScriptRoot "..\icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$outFile = Join-Path $outDir "$OutName.svg"
curl.exe -sL $url -o $outFile
Write-Host "Saved $outFile (use get-icon MCP in Cursor for production)"
