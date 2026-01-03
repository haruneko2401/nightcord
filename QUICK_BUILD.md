# ⚡ Build nhanh Nightcord

## ✅ Git đã được fix!

Git đã được thêm vào PATH. Bạn có thể build ngay:

## 🚀 Build Android APK

```powershell
eas build --platform android --profile preview
```

## 🍎 Build iOS

```powershell
eas build --platform ios --profile preview
```

## 📱 Build cả 2

```powershell
eas build --platform all --profile preview
```

## ⚠️ Lưu ý

- File `eas.json` đã được tạo sẵn, không cần chạy `eas build:configure`
- Đảm bảo đã đăng nhập: `eas login`
- Build sẽ mất 10-30 phút tùy platform

## 🔧 Thêm Git vào PATH vĩnh viễn (Tùy chọn)

Nếu muốn Git luôn có trong PATH (không cần thêm mỗi lần mở PowerShell mới):

1. **Chạy PowerShell với quyền Administrator**
2. Chạy script:
```powershell
.\fix-git-path.ps1
```
3. **Khởi động lại PowerShell**

Hoặc thêm thủ công:
- Mở "Environment Variables" trong Windows
- Thêm `C:\Program Files\Git\bin` vào User PATH

