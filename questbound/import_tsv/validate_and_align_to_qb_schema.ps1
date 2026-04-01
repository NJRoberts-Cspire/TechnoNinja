param(
  [Parameter(Mandatory=$true)]
  [string]$QbExportFolder,

  [Parameter(Mandatory=$false)]
  [string]$SourceFolder = ".",

  [Parameter(Mandatory=$false)]
  [string]$OutputFolder = "./aligned_for_qb"
)

$ErrorActionPreference = 'Stop'

function Read-Tsv {
  param([string]$Path)
  Import-Csv -Path $Path -Delimiter "`t"
}

function Write-Tsv {
  param([string]$Path, [array]$Rows, [string[]]$Headers)
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  $lines = @()
  $lines += ($Headers -join "`t")
  foreach ($r in $Rows) {
    $vals = foreach ($h in $Headers) {
      $v = $r.$h
      if ($null -eq $v) { "" } else { [string]$v }
    }
    $lines += ($vals -join "`t")
  }
  Set-Content -Path $Path -Value $lines -Encoding UTF8
}

if (-not (Test-Path $QbExportFolder)) {
  throw "QbExportFolder not found: $QbExportFolder"
}
if (-not (Test-Path $SourceFolder)) {
  throw "SourceFolder not found: $SourceFolder"
}

$sourceFiles = Get-ChildItem -Path $SourceFolder -Filter *.tsv -File
if ($sourceFiles.Count -eq 0) {
  throw "No TSV files found in SourceFolder: $SourceFolder"
}

if (-not (Test-Path $OutputFolder)) {
  New-Item -ItemType Directory -Path $OutputFolder | Out-Null
}

$report = @()

foreach ($sf in $sourceFiles) {
  $targetPath = Join-Path $QbExportFolder $sf.Name
  if (-not (Test-Path $targetPath)) {
    $report += [pscustomobject]@{
      file = $sf.Name
      status = 'no_matching_qb_file'
      detail = 'Skipped. No file with same name in QB export.'
    }
    continue
  }

  $srcRows = Read-Tsv -Path $sf.FullName
  $qbRows = Read-Tsv -Path $targetPath

  if ($qbRows.Count -eq 0) {
    $qbHeaders = (Get-Content $targetPath -TotalCount 1) -split "`t"
  } else {
    $qbHeaders = $qbRows[0].PSObject.Properties.Name
  }

  if ($srcRows.Count -eq 0) {
    $alignedRows = @()
  } else {
    $srcHeaders = $srcRows[0].PSObject.Properties.Name
    $common = @($qbHeaders | Where-Object { $srcHeaders -contains $_ })

    # Keep QB header order and fill missing with blank.
    $alignedRows = foreach ($r in $srcRows) {
      $o = [ordered]@{}
      foreach ($h in $qbHeaders) {
        if ($common -contains $h) {
          $o[$h] = $r.$h
        } else {
          $o[$h] = ""
        }
      }
      [pscustomobject]$o
    }
  }

  $outPath = Join-Path $OutputFolder $sf.Name
  Write-Tsv -Path $outPath -Rows $alignedRows -Headers $qbHeaders

  $srcHeaderList = if ($srcRows.Count -gt 0) { $srcRows[0].PSObject.Properties.Name } else { @() }
  $missingInSrc = @($qbHeaders | Where-Object { $srcHeaderList -notcontains $_ })
  $extraInSrc = @($srcHeaderList | Where-Object { $qbHeaders -notcontains $_ })

  $report += [pscustomobject]@{
    file = $sf.Name
    status = 'aligned'
    qb_headers = ($qbHeaders -join ',')
    missing_in_source = ($missingInSrc -join ',')
    extra_in_source = ($extraInSrc -join ',')
  }
}

$reportPath = Join-Path $OutputFolder 'alignment_report.tsv'
$report | Export-Csv -Path $reportPath -Delimiter "`t" -NoTypeInformation -Encoding UTF8

Write-Output "Alignment complete. Output folder: $OutputFolder"
Write-Output "Report: $reportPath"
