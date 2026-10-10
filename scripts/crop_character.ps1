Add-Type -AssemblyName System.Drawing

function Crop-Image([string]$sourcePath, [string]$destPath, [int]$x, [int]$y, [int]$w, [int]$h) {
    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
    Write-Host "Saved $destPath ($w by $h)"
}

Crop-Image "public/assets/raw_frame_1.jpg" "public/assets/character-center.jpg" 235 264 235 315
Crop-Image "public/assets/raw_frame_4.5.jpg" "public/assets/character-left.jpg" 230 264 235 315
Crop-Image "public/assets/raw_frame_6.jpg" "public/assets/character-right.jpg" 240 264 235 315
Crop-Image "public/assets/raw_frame_1.8.jpg" "public/assets/character-rest.jpg" 230 264 235 315
