Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("public/assets/raw_frame_1.jpg")
Write-Host "Width=$($bmp.Width) Height=$($bmp.Height)"
for ($y = 200; $y -lt 700; $y += 50) {
    $c = $bmp.GetPixel(270, $y)
    Write-Host ("y=" + $y + ": R=" + $c.R + " G=" + $c.G + " B=" + $c.B)
}
$bmp.Dispose()
