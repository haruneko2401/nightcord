# 🔧 Sửa lỗi "Bundle JavaScript build phase failed"

## ❌ Lỗi gặp phải

```
Android build failed:
Unknown error. See logs of the Bundle JavaScript build phase for more information.
```

## 🔍 Nguyên nhân

Thiếu file cấu hình Babel (`babel.config.js`) - cần thiết để bundle JavaScript code.

## ✅ Giải pháp

### Đã sửa:

1. **Tạo `babel.config.js`** - File cấu hình Babel cho Expo
2. **Thêm `babel-preset-expo`** vào devDependencies

### Các bước tiếp theo:

1. **Cài lại dependencies:**
```powershell
npm install
```

2. **Commit và push:**
```powershell
$env:PATH += ";C:\Program Files\Git\bin"
git add babel.config.js package.json package-lock.json
git commit -m "Fix: Add babel.config.js for JavaScript bundling"
git push
```

3. **Build lại:**
```powershell
eas build --platform android --profile preview --clear-cache
```

Hoặc build cả 2:
```powershell
eas build --platform all --profile preview --clear-cache
```

---

## 📝 Lưu ý

- `--clear-cache` để đảm bảo build với code mới nhất
- `babel.config.js` là file bắt buộc cho Expo projects
- `babel-preset-expo` cần thiết để transpile code đúng cách

---

## 🎯 Nếu vẫn lỗi

Kiểm tra log chi tiết tại link EAS cung cấp để xem lỗi cụ thể.

