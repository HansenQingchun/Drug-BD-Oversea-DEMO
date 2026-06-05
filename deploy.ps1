<#
.SYNOPSIS
  一键把「启星智谷 · 药物出海评估 DEMO」部署到腾讯云服务器（或任意 Linux 服务器）。

.DESCRIPTION
  脚本会自动：1) 打包前端 (npm run build)  2) 压缩 dist  3) 通过 scp 上传到服务器
  4) 通过 ssh 解压到网站子目录。完成后即可通过 https://你的域名/drug-demo/ 访问。

  你只需要准备两样东西：服务器公网 IP、以及该服务器的登录密码（脚本运行时会提示你自己输入，
  密码不会被保存）。

.PARAMETER ServerIP
  服务器公网 IP，例如 123.45.67.89

.PARAMETER User
  SSH 登录用户名，腾讯云轻量/CVM 通常是 root（Ubuntu 镜像可能是 ubuntu）。默认 root。

.PARAMETER WebRoot
  服务器上的网站根目录。宝塔面板默认是 /www/wwwroot/你的域名 。
  例如 /www/wwwroot/example.com

.PARAMETER Subdir
  部署到网站根目录下的哪个子目录，默认 drug-demo（访问地址即 /drug-demo/）。

.EXAMPLE
  .\deploy.ps1 -ServerIP 123.45.67.89 -WebRoot /www/wwwroot/example.com

.EXAMPLE
  .\deploy.ps1 -ServerIP 123.45.67.89 -User ubuntu -WebRoot /var/www/html -Subdir drug-demo
#>
param(
  [Parameter(Mandatory = $true)] [string]$ServerIP,
  [string]$User = 'root',
  [Parameter(Mandatory = $true)] [string]$WebRoot,
  [string]$Subdir = 'drug-demo',
  [int]$Port = 22
)

$ErrorActionPreference = 'Stop'
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectDir

Write-Host "==> 1/4 打包前端 (npm run build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build 失败，请先修复构建错误。" }

Write-Host "==> 2/4 压缩 dist..." -ForegroundColor Cyan
$zip = Join-Path $ProjectDir 'drug-demo-dist.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $ProjectDir 'dist\*') -DestinationPath $zip

$remoteTarget = "$WebRoot/$Subdir"
$remoteTmp = "/tmp/drug-demo-dist.zip"

Write-Host "==> 3/4 上传到 ${User}@${ServerIP}:${remoteTmp} ..." -ForegroundColor Cyan
Write-Host "    (接下来会提示输入服务器密码)" -ForegroundColor Yellow
scp -P $Port $zip "${User}@${ServerIP}:${remoteTmp}"
if ($LASTEXITCODE -ne 0) { throw "scp 上传失败，请检查 IP / 用户名 / 密码 / 安全组是否放行 22 端口。" }

Write-Host "==> 4/4 在服务器上解压到 $remoteTarget ..." -ForegroundColor Cyan
Write-Host "    (可能再次提示输入服务器密码)" -ForegroundColor Yellow
$remoteCmd = "mkdir -p '$remoteTarget' && (command -v unzip >/dev/null 2>&1 || (apt-get update -y && apt-get install -y unzip) || yum install -y unzip) && unzip -o '$remoteTmp' -d '$remoteTarget' && rm -f '$remoteTmp' && echo DONE"
ssh -p $Port "${User}@${ServerIP}" $remoteCmd
if ($LASTEXITCODE -ne 0) { throw "远程解压失败，请检查 WebRoot 路径是否正确、用户是否有写权限。" }

Write-Host ""
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "   访问地址： https://你的域名/$Subdir/   （或 http://$ServerIP/$Subdir/ ）" -ForegroundColor Green
Write-Host "   若打不开，请确认该域名/服务器的 Web 服务（Nginx/Apache）网站根目录就是 $WebRoot" -ForegroundColor Gray
