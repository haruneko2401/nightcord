# 🔧 Sửa lỗi thiếu packages bắt buộc

## ❌ Lỗi gặp phải

```
Error: The required package `expo-asset` cannot be found
Missing peer dependency: expo-font
```

## 🔍 Nguyên nhân

Thiếu các packages bắt buộc cho Expo:
- `expo-asset` - Xử lý assets (hình ảnh, fonts, etc.)
- `expo-font` - Xử lý fonts (peer dependency của @expo/vector-icons)

## ✅ Giải pháp

Đã cập nhật `package.json` với:
- ✅ `expo-asset`: `~11.0.0`
- ✅ `expo-font`: `~13.0.0`
- ✅ Fix version để match Expo SDK 52:
  - `@expo/vector-icons`: `~14.0.4`
  - `react-native`: `0.76.9`
  - `babel-preset-expo`: `~12.0.0`

## 📋 Các bước tiếp theo

### 1. Cài lại dependencies:

```powershell
npm install
```

### 2. Commit và push:

```powershell
$env:PATH += ";C:\Program Files\Git\bin"
git add package.json package-lock.json
git commit -m "Fix: Add missing expo-asset and expo-font packages"
git push
```

### 3. Build lại:

```powershell
eas build --platform android --profile preview --clear-cache
```

Hoặc build cả 2:
```powershell
eas build --platform all --profile preview --clear-cache
```

---

## 🎯 Lưu ý

- `expo-asset` là package **bắt buộc** cho mọi Expo project
- `expo-font` cần thiết khi dùng `@expo/vector-icons`
- Luôn dùng `npx expo install <package>` để đảm bảo version đúng với Expo SDK

---

## ✅ Kiểm tra sau khi cài

Chạy lệnh này để kiểm tra:
```powershell
npx expo-doctor
```

Tất cả checks phải pass!

