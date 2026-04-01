# Run Alignment Script

Example command from PowerShell:

```powershell
Set-Location "c:\Users\jetin\SamuriTehcno\questbound\import_tsv"
.\validate_and_align_to_qb_schema.ps1 -QbExportFolder "c:\path\to\unzipped_qb_export" -SourceFolder "." -OutputFolder ".\aligned_for_qb"
```

Then import files from:

- `questbound/import_tsv/aligned_for_qb/`

Read the generated report:

- `questbound/import_tsv/aligned_for_qb/alignment_report.tsv`
