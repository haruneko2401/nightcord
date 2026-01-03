# 🔧 Sửa lỗi Gradle Build Failed

## ❌ Lỗi gặp phải

```
Unresolved reference: serviceOf
Build file '/home/expo/workingdir/build/node_modules/@react-native/gradle-plugin/build.gradle.kts'
```

## 🔍 Nguyên nhân

Version không tương thích giữa:
- **Expo SDK 54** (mới nhất)
- **React Native 0.72.17** (cũ)
- **Gradle 8.14.3** (mới nhất)

Expo SDK 54 yêu cầu React Native 0.76.x, nhưng package.json đang dùng 0.72.17.

## ✅ Giải pháp

### Cách 1: Downgrade Expo SDK (Khuyến nghị)

Đã cập nhật `package.json` để dùng Expo SDK 52 (ổn định hơn):

```json
{
  "expo": "~52.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5"
}
```

**Các bước:**

1. **Xóa node_modules và package-lock.json:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
```

2. **Cài lại dependencies:**
```powershell
npm install
```

3. **Build lại:**
```powershell
$env:PATH += ";C:\Program Files\Git\bin"
eas build --platform android --profile preview
```

### Cách 2: Dùng Expo SDK 54 với React Native đúng version

Nếu muốn dùng Expo SDK 54, cần update React Native:

```json
{
  "expo": "~54.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5"
}
```

Sau đó chạy:
```powershell
npm install
```

### Cách 3: Clear cache và build lại

```powershell
eas build --platform android --profile preview --clear-cache
```

---

## 🎯 Khuyến nghị

**Dùng Expo SDK 52** (đã cập nhật trong package.json):
- ✅ Ổn định hơn
- ✅ Tương thích tốt với Gradle
- ✅ Ít lỗi hơn

---

## 📝 Lưu ý

Sau khi update dependencies, commit lại:
```powershell
git add package.json package-lock.json
git commit -m "Fix: Update dependencies for Gradle compatibility"
git push
```

Sau đó build lại trên EAS.

