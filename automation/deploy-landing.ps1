<#
  deploy-landing.ps1 — Đẩy 1 landing tĩnh lên VPS iNET vào /var/www/html/<name>/
  (non-destructive: chỉ thả file, KHÔNG sửa nginx, KHÔNG đụng FOODAY).

  Cách dùng:
    pwsh ./automation/deploy-landing.ps1 -Landing cinai-cartoon-mid -Name cartoon-mid
    pwsh ./automation/deploy-landing.ps1 -Landing cinai-studio-qc   -Name studio-qc

  Đọc thông tin VPS từ .env.local ở gốc repo (VPS_HOST, VPS_SSH_PORT, VPS_SSH_USER,
  VPS_SSH_PASSWORD, VPS_HOSTKEY_ED25519, VPS_WEBROOT).
#>
param(
  [Parameter(Mandatory=$true)][string]$Landing,
  [Parameter(Mandatory=$true)][string]$Name
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot

# --- nạp .env.local ---
$envFile = Join-Path $repo '.env.local'
if (-not (Test-Path $envFile)) { throw ".env.local không tồn tại ở $repo" }
$cfg = @{}
Get-Content $envFile | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
  $k,$v = $_ -split '=',2; $cfg[$k.Trim()] = $v.Trim()
}
$ip   = $cfg['VPS_HOST']; $port = $cfg['VPS_SSH_PORT']; $user = $cfg['VPS_SSH_USER']
$pw   = $cfg['VPS_SSH_PASSWORD']; $hk = $cfg['VPS_HOSTKEY_ED25519']
$root = $cfg['VPS_WEBROOT']; if (-not $root) { $root = '/var/www/html' }

# --- đảm bảo có plink/pscp ---
$tool = Join-Path $env:TEMP 'ladipage-deploy'
New-Item -ItemType Directory -Force -Path $tool | Out-Null
$plink = Join-Path $tool 'plink.exe'; $pscp = Join-Path $tool 'pscp.exe'
if (-not (Test-Path $plink)) { Invoke-WebRequest 'https://the.earth.li/~sgtatham/putty/latest/w64/plink.exe' -OutFile $plink -UseBasicParsing }
if (-not (Test-Path $pscp))  { Invoke-WebRequest 'https://the.earth.li/~sgtatham/putty/latest/w64/pscp.exe'  -OutFile $pscp  -UseBasicParsing }

# --- nguồn + danh sách phần cần đẩy (bỏ rác: extraction, .playwright-mcp, *.md, *.png, env.local) ---
$src = Join-Path $repo "landings\$Landing"
if (-not (Test-Path (Join-Path $src 'index.html'))) { throw "Không thấy index.html trong $src" }
$items = @('index.html')
foreach ($d in 'assets','scripts','styles','sections','fonts') {
  if (Test-Path (Join-Path $src $d)) { $items += $d }
}
$sources = $items | ForEach-Object { Join-Path $src $_ }

Write-Host "[deploy] $Landing -> $root/$Name  (phần: $($items -join ', '))" -ForegroundColor Cyan

# --- tạo thư mục đích ---
& $plink -ssh -batch -P $port -hostkey $hk -pw $pw "$user@$ip" "mkdir -p $root/$Name && echo MKDIR_OK"
if ($LASTEXITCODE -ne 0) { throw "Không tạo được thư mục đích (IP có thể đang bị OneShield chặn)." }

# --- upload ---
& $pscp -P $port -hostkey $hk -pw $pw -r -batch @sources "$user@${ip}:$root/$Name/"
if ($LASTEXITCODE -ne 0) { throw "Upload thất bại (exit $LASTEXITCODE)." }

# --- chỉnh quyền + xác minh ---
$verify = "chown -R www-data:www-data $root/$Name; find $root/$Name -type d -exec chmod 755 {} +; find $root/$Name -type f -exec chmod 644 {} +; echo files=`$(find $root/$Name -type f | wc -l); echo mp4=`$(find $root/$Name -name '*.mp4' | wc -l); du -sh $root/$Name"
& $plink -ssh -batch -P $port -hostkey $hk -pw $pw "$user@$ip" $verify

Write-Host "[OK] Live: $($cfg['VPS_PUBLIC_BASE'])/$Name/" -ForegroundColor Green
