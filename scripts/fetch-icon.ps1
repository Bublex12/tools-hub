# Скачать SVG из коллекции icons0 / Iconify (формат prefix:name)
# Пример: .\fetch-icon.ps1 lucide:braces json-decoder
param(
  [Parameter(Mandatory)][string]$IconId,
  [Parameter(Mandatory)][string]$OutName
)

$path = $IconId -replace ":", "/"
$url = "https://api.iconify.design/$path.svg?color=%23FF5A1F"
$outDir = Join-Path $PSScriptRoot "..\icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$outFile = Join-Path $outDir "$OutName.svg"
curl.exe -sL $url -o $outFile
Write-Host "Saved $outFile"
