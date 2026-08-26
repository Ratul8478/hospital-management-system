Add-Type -AssemblyName System.Drawing
$icon = [System.Drawing.Image]::FromFile('app_logo_custom.png')
$bmpIcon = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($bmpIcon)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($icon, 0, 0, 512, 512)
$bmpIcon.Save('play_store_icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()

$bmpBanner = New-Object System.Drawing.Bitmap(1024, 500)
$gBanner = [System.Drawing.Graphics]::FromImage($bmpBanner)
$gBanner.Clear([System.Drawing.Color]::FromArgb(255, 240, 248, 255)) # AliceBlue or some nice light color
# Draw the logo in the middle
$x = (1024 - 300) / 2
$y = (500 - 300) / 2
$gBanner.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gBanner.DrawImage($icon, $x, $y, 300, 300)

# Optional: Add text
$font = New-Object System.Drawing.Font('Arial', 36, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 51, 102))
$stringFormat = New-Object System.Drawing.StringFormat
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
$gBanner.DrawString('Medix Doctor', $font, $brush, 512, 400, $stringFormat)

$bmpBanner.Save('play_store_feature_graphic.png', [System.Drawing.Imaging.ImageFormat]::Png)
$gBanner.Dispose()
