Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\hp\.gemini\antigravity-ide\brain\28d964b3-ccd1-451a-99c5-bfd112c4d30e\.user_uploaded\media_1789398241628.jpg")
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$null = New-Item -ItemType Directory -Force -Path "scratch"

function CropLogo($x, $y, $w, $h, $name) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $rectSrc = New-Object System.Drawing.Rectangle $x, $y, $w, $h
    $rectDest = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $g.DrawImage($img, $rectDest, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save("scratch/$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$W = $img.Width
$H = $img.Height

CropLogo ([int]($W*0.15)) ([int]($H*0.53)) ([int]($W*0.22)) ([int]($H*0.07)) "crop_k8s"
CropLogo ([int]($W*0.64)) ([int]($H*0.53)) ([int]($W*0.22)) ([int]($H*0.07)) "crop_docker"
CropLogo ([int]($W*0.15)) ([int]($H*0.65)) ([int]($W*0.22)) ([int]($H*0.07)) "crop_prometheus"
CropLogo ([int]($W*0.15)) ([int]($H*0.87)) ([int]($W*0.22)) ([int]($H*0.07)) "crop_gitlab"

$img.Dispose()
Write-Host "Done"
