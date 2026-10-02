$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$sourceDirectory = 'C:\Users\jorge\.codex\generated_images\01a0bbbd-5b6a-7a50-a9e8-b6036c3d9a06'
$assets = @{
  buffet = '458a296a-ebc2-468d-a587-e714a5f50e22'
  bartender = '74250675-8275-4dc9-bc2f-bdb2343bf418'
  mozos = '583f05be-9645-46a8-aebd-0204bb4e8484'
  menaje = '2f572674-35c2-4a85-98cf-051077e1ce90'
  sillas = 'e7e75c89-06e7-4b06-be81-44b60f266bfe'
  flores = '1112fbb6-d386-40df-a41d-fa043aca4f2b'
  recuerdos = '7115a59f-5441-4306-acde-493cbd8fdb59'
  polos = 'e72e0b17-479f-412f-91ac-750d3157bbca'
}
$destination = Join-Path $PSScriptRoot '../public/images/mesa'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
$manifest = @{}
foreach ($name in $assets.Keys) {
  $source = [System.Drawing.Image]::FromFile((Join-Path $sourceDirectory "exec-$($assets[$name]).png"))
  $variants = @()
  foreach ($width in @(480, 768, 1280)) {
    $height = [int][Math]::Round($source.Height * $width / $source.Width)
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($source, 0, 0, $width, $height)
    $file = Join-Path $destination "$name-$width.jpg"
    $bitmap.Save($file, $encoder, $parameters)
    $graphics.Dispose(); $bitmap.Dispose()
    $variants += @{ url = "/images/mesa/$name-$width.jpg"; width = $width; height = $height; bytes = (Get-Item -LiteralPath $file).Length }
  }
  $source.Dispose()
  $manifest[$name] = $variants
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 (Join-Path $PSScriptRoot '../data/design-images.json')
$parameters.Dispose()
$manifest | ConvertTo-Json -Depth 5
