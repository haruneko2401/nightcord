# 🔧 Sửa lỗi Git với EAS CLI

## Vấn đề
EAS CLI yêu cầu Git để hoạt động, nhưng Git chưa được cài đặt hoặc không có trong PATH.

## ✅ Giải pháp 1: Cài Git (Khuyến nghị)

### Cách 1: Cài Git for Windows
1. Tải Git từ: https://git-scm.com/download/win
2. Cài đặt với tất cả tùy chọn mặc định
3. **Quan trọng:** Chọn "Add Git to PATH" khi cài
4. Khởi động lại PowerShell/Terminal
5. Kiểm tra: `git --version`

### Cách 2: Cài qua winget (Windows 10/11)
```powershell
winget install --id Git.Git -e --source winget
```

Sau khi cài, khởi động lại PowerShell và chạy lại:
```bash
eas build:configure
```

---

## ⚡ Giải pháp 2: Dùng file eas.json có sẵn (Nhanh nhất)

Tôi đã tạo file `eas.json` với cấu hình sẵn cho bạn. Bạn có thể bỏ qua bước `eas build:configure` và build trực tiếp:

### Build Android APK:
```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile preview
```

### Build iOS:
```powershell
$env:EAS_NO_VCS=1
eas build --platform ios --profile preview
```

### Build cả 2:
```powershell
$env:EAS_NO_VCS=1
eas build --platform all --profile preview
```

**Lưu ý:** Vẫn nên cài Git sau để EAS CLI hoạt động tốt hơn.

---

## 🎯 Khuyến nghị

**Cài Git** là cách tốt nhất vì:
- EAS CLI hoạt động tốt hơn
- Có thể quản lý version code
- Cần thiết cho nhiều công cụ khác

Sau khi cài Git, chạy lại:
```bash
eas build:configure
```

