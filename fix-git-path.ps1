# Script để thêm Git vào PATH vĩnh viễn
# Chạy PowerShell với quyền Administrator

$gitPath = "C:\Program Files\Git\bin"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*$gitPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$gitPath", "User")
    Write-Host "✅ Đã thêm Git vào PATH!" -ForegroundColor Green
    Write-Host "⚠️  Khởi động lại PowerShell để áp dụng thay đổi." -ForegroundColor Yellow
} else {
    Write-Host "✅ Git đã có trong PATH rồi!" -ForegroundColor Green
}

