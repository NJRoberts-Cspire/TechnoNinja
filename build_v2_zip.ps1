param(
    [string]$Base = 'c:\Users\nroberts\TechnoNinja\tesshari_v2',
    [string]$Dest = 'c:\Users\nroberts\TechnoNinja\tesshari_0.4.0.zip'
)

Add-Type -Assembly System.IO.Compression.FileSystem
Add-Type -Assembly System.IO.Compression

if (Test-Path $Dest) { Remove-Item $Dest }

$stream  = [IO.File]::Open($Dest, [IO.FileMode]::Create)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)

try {
    $prefixLen = $Base.Length + 1
    Get-ChildItem -Path $Base -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($prefixLen).Replace([IO.Path]::DirectorySeparatorChar, '/')
        $entry = $archive.CreateEntry($rel, [IO.Compression.CompressionLevel]::Optimal)
        $es = $entry.Open()
        $fs = [IO.File]::OpenRead($_.FullName)
        try { $fs.CopyTo($es) } finally { $fs.Close(); $es.Close() }
    }
}
finally {
    $archive.Dispose()
    $stream.Close()
}

Write-Host "Zip: $Dest"
Get-Item $Dest | Select-Object Name, Length
