Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("public/assets/character-center.jpg")
$c1 = $bmp.GetPixel(5, 5)
$c2 = $bmp.GetPixel(230, 5)
$c3 = $bmp.GetPixel(5, 310)
$c4 = $bmp.GetPixel(230, 310)
Write-Host "Top-Left: R=$($c1.R) G=$($c1.G) B=$($c1.B)"
Write-Host "Top-Right: R=$($c2.R) G=$($c2.G) B=$($c2.B)"
Write-Host "Bottom-Left: R=$($c3.R) G=$($c3.G) B=$($c3.B)"
Write-Host "Bottom-Right: R=$($c4.R) G=$($c4.G) B=$($c4.B)"
$bmp.Dispose()
