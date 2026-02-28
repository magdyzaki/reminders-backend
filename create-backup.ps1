# نسخة احتياطية مضغوطة من مشروع التنبيهات (بدون node_modules)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$date = Get-Date -Format 'yyyyMMdd-HHmm'
$dest = Join-Path (Split-Path -Parent $scriptDir) "reminders-backend-backup-$date.zip"

$toInclude = @()
$items = @("index.js", "db.js", "db-mongo.js", "db-lowdb.js", "routes", "middleware", 
           "package.json", "package-lock.json", "Procfile", "render.yaml", ".gitignore",
           "replit.nix", ".replit")
foreach ($item in $items) {
    if (Test-Path $item) { $toInclude += $item }
}
Get-ChildItem -Filter "*.md" | ForEach-Object { $toInclude += $_.Name }
if (Test-Path "create-backup.ps1") { $toInclude += "create-backup.ps1" }
# لا تضف .env (بيانات حساسة) ولا node_modules

Compress-Archive -Path $toInclude -DestinationPath $dest -Force
Write-Host "تم إنشاء النسخة الاحتياطية: $dest"
Get-Item $dest | Select-Object Name, @{N='Size (KB)';E={[math]::Round($_.Length/1KB,2)}}
