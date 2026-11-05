# Applies supabase/migrations using SUPABASE_DB_URL from .env.local.
# Previews by default; pass -Apply to write to the database.
param([switch]$Apply)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$match = Select-String -Path ".env.local" -Pattern '^SUPABASE_DB_URL=(.+)$' | Select-Object -First 1
if (-not $match) { throw "SUPABASE_DB_URL is empty in .env.local" }
$url = $match.Matches[0].Groups[1].Value.Trim().Trim('"')

if ($Apply) {
  supabase db push --db-url $url
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  supabase migration list --db-url $url
} else {
  supabase db push --dry-run --db-url $url
}
exit $LASTEXITCODE
