Add-Type -AssemblyName System.Drawing

function Create-Enhanced-Character(
    [string]$srcPath, 
    [string]$destPath, 
    [int]$cropX, [int]$cropY, [int]$cropW, [int]$cropH,
    [int]$outW, [int]$outH
) {
    $src = [System.Drawing.Image]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($outW, $outH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $outW, $outH)
    
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    # Clean bottom-right watermark if any
    # Bottom right corner (last 10% x, last 10% y) if dark (<50), replace with background tone
    $bgR = 222; $bgG = 217; $bgB = 208
    for ($x = [int]($outW * 0.82); $x -lt $outW; $x++) {
        for ($y = [int]($outH * 0.82); $y -lt $outH; $y++) {
            $px = $bmp.GetPixel($x, $y)
            if ($px.R -lt 70 -and $px.G -lt 70 -and $px.B -lt 70) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($bgR, $bgG, $bgB))
            }
        }
    }

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
    Write-Host "Created enhanced $destPath ($outW x $outH)"
}

# Generate 940x1260 (4x crisp resolution)
Create-Enhanced-Character "public/assets/raw_frame_1.jpg" "public/assets/character-center.jpg" 235 264 235 310 940 1240
Create-Enhanced-Character "public/assets/raw_frame_4.5.jpg" "public/assets/character-left.jpg" 230 264 235 310 940 1240
Create-Enhanced-Character "public/assets/raw_frame_6.jpg" "public/assets/character-right.jpg" 240 264 235 310 940 1240
Create-Enhanced-Character "public/assets/raw_frame_1.8.jpg" "public/assets/character-rest.jpg" 230 264 235 310 940 1240
