Get-ChildItem -Path 'd:/web/planetary-planet/src/pages/optics' -Filter *.astro | ForEach-Object {
    $b = [System.IO.File]::ReadAllBytes($_.FullName)
    $bom = ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF)
    $first = ($b[0..5] | ForEach-Object { $_.ToString('X2') }) -join ' '
    Write-Output ($_.Name + ' | BOM=' + $bom + ' | FirstBytes=' + $first)
}
