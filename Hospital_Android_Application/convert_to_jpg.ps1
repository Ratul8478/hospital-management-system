Add-Type -AssemblyName System.Drawing

function ConvertTo-Jpeg($inputFile, $outputFile) {
    if (Test-Path $inputFile) {
        $img = [System.Drawing.Image]::FromFile($inputFile)
        $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::White)
        $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
        $bmp.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $g.Dispose()
        $bmp.Dispose()
        $img.Dispose()
    }
}

ConvertTo-Jpeg 'play_store_icon.png' 'play_store_icon.jpg'
ConvertTo-Jpeg 'play_store_feature_graphic.png' 'play_store_feature_graphic.jpg'
ConvertTo-Jpeg 'final_screenshot1.png' 'final_screenshot1.jpg'
ConvertTo-Jpeg 'final_screenshot2.png' 'final_screenshot2.jpg'
