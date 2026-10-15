Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/character-center.jpg"))
$tl = $bmp.GetPixel(5, 5)
$tr = $bmp.GetPixel($bmp.Width - 5, 5)
$ml = $bmp.GetPixel(5, [int]($bmp.Height/2))
$mr = $bmp.GetPixel($bmp.Width - 5, [int]($bmp.Height/2))
Write-Host "TopLeft: $($tl.R), $($tl.G), $($tl.B)"
Write-Host "TopRight: $($tr.R), $($tr.G), $($tr.B)"
Write-Host "MidLeft: $($ml.R), $($ml.G), $($ml.B)"
Write-Host "MidRight: $($mr.R), $($mr.G), $($mr.B)"
$bmp.Dispose()
