# Script tự động build cả Android và iOS
# Chạy script này: .\build-auto.ps1

# Thêm Git vào PATH
$env:PATH += ";C:\Program Files\Git\bin"

Write-Host "🚀 Bắt đầu build cả Android và iOS..." -ForegroundColor Green
Write-Host ""

# Build cả 2 platform
# Lưu ý: Bạn vẫn cần trả lời các câu hỏi tương tác về credentials
eas build --platform all --profile preview

Write-Host ""
Write-Host "✅ Build đã bắt đầu!" -ForegroundColor Green
Write-Host "📱 Kiểm tra tiến trình tại: https://expo.dev/accounts/harukisakurai25/projects/nightcord/builds" -ForegroundColor Cyan

