Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("public/assets/raw_frame_1.jpg")
for ($x = 0; $x -lt 540; $x += 40) {
    $c = $bmp.GetPixel($x, 400)
    Write-Host ("x=" + $x + ": R=" + $c.R + " G=" + $c.G + " B=" + $c.B)
}
$bmp.Dispose()
