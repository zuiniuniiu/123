<#
.SYNOPSIS
  一键 add → commit → push 脚本。每轮改动完成后执行此脚本自动提交并推送。
.DESCRIPTION
  将所有已跟踪和未跟踪的改动 add → commit（含自定义或自动消息）→ push 到远端。
  如果 commit 消息为空，自动生成基于改动的消息。
.PARAMETER Message
  commit 消息。不传则自动生成 "feat: update" + 日期。
.EXAMPLE
  .\git-push.ps1 "feat: 实现座位列表筛选功能"
  .\git-push.ps1
#>

param(
    [string]$Message = ""
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectRoot

# 检查是否有未提交改动
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ 没有未提交的改动，跳过 commit" -ForegroundColor Green
    exit 0
}

# 生成 commit 消息
if ([string]::IsNullOrWhiteSpace($Message)) {
    $date = Get-Date -Format "MM-dd HH:mm"
    $Message = "feat: update $date"
}

Write-Host "📦 正在执行 git add -A ..." -ForegroundColor Cyan
git add -A

Write-Host "📝 提交: $Message" -ForegroundColor Cyan
git commit -m $Message

Write-Host "☁️  正在推送至远端 (origin master) ..." -ForegroundColor Cyan
git push origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 提交并推送成功！" -ForegroundColor Green
} else {
    Write-Host "❌ 推送失败，请检查网络或远端配置" -ForegroundColor Red
}
