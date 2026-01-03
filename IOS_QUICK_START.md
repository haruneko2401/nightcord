# 🍎 Hướng dẫn nhanh Build iOS cho Nightcord

## ⚡ Test nhanh nhất (Miễn phí)

### Dùng Expo Go (Không cần build gì cả)

```bash
# 1. Cài dependencies
npm install

# 2. Chạy server
npm start

# 3. Quét QR code bằng Camera app trên iPhone
# 4. Share link với người khác (họ cũng cần Expo Go)
```

**Lưu ý:** Cả bạn và người test phải cùng WiFi hoặc dùng tunnel.

---

## 🚀 Build để test thực tế

### Option 1: Development Build (Miễn phí với Apple ID cá nhân)

Chỉ test trên thiết bị của bạn, không cần Apple Developer Account ($99).

```bash
# 1. Cài EAS CLI
npm install -g eas-cli

# 2. Đăng nhập
eas login

# 3. Cấu hình
eas build:configure
# Chọn iOS → Yes
# Profile → development

# 4. Build
eas build --platform ios --profile development

# 5. Cài trên iPhone (sau khi build xong)
eas build:run --platform ios
```

---

### Option 2: TestFlight (Cần Apple Developer Account - $99/năm)

Để test với nhiều người qua TestFlight.

```bash
# 1. Setup Apple Developer credentials
eas credentials

# 2. Build preview
eas build --platform ios --profile preview

# 3. Submit lên TestFlight (tự động)
eas submit --platform ios

# 4. Thêm testers trong App Store Connect
# 5. Testers nhận email và cài qua TestFlight app
```

---

## 📋 Checklist trước khi build iOS

- [ ] Đã cài `npm install`
- [ ] Đã có Expo account (miễn phí)
- [ ] Đã có Apple ID (miễn phí) hoặc Apple Developer Account ($99/năm)
- [ ] Đã cài EAS CLI: `npm install -g eas-cli`
- [ ] Đã đăng nhập: `eas login`

---

## ⚠️ Lưu ý quan trọng

1. **Apple Developer Account ($99/năm):**
   - Cần để phân phối qua TestFlight/App Store
   - Không cần nếu chỉ test trên thiết bị của bạn

2. **Development Build:**
   - Miễn phí với Apple ID cá nhân
   - Chỉ cài được trên thiết bị của bạn
   - Cần kết nối máy tính để cài lần đầu

3. **TestFlight:**
   - Miễn phí với Apple Developer Account
   - Tối đa 10,000 testers
   - Build hết hạn sau 90 ngày

4. **Build time:** 20-30 phút (lâu hơn Android)

---

## 🎯 Khuyến nghị

- **Test ngay:** Expo Go (miễn phí, không cần build)
- **Test thực tế (1 người):** Development Build (miễn phí với Apple ID)
- **Test với nhiều người:** TestFlight (cần $99/năm nhưng chuyên nghiệp)

