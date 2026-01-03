# Nightcord - Discord Clone App

Ứng dụng chat giống Discord được xây dựng với React Native và Expo.

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

## 📱 Build APK để test

### Cách 1: EAS Build (Khuyến nghị - Miễn phí)

1. **Cài đặt EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Đăng nhập Expo:**
```bash
eas login
```

3. **Khởi tạo EAS Build:**
```bash
eas build:configure
```

4. **Build APK:**
```bash
eas build --platform android --profile preview
```

5. **Tải APK:** Sau khi build xong, bạn sẽ nhận được link tải APK. Share link này cho người khác để test.

### Cách 2: Build APK local (Nhanh hơn, không cần account)

**Lưu ý:** Cần cài Android Studio và Java JDK.

```bash
# Cài đặt Expo CLI
npm install -g expo-cli

# Prebuild (tạo native code)
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK sẽ ở: android/app/build/outputs/apk/release/app-release.apk
```

### Cách 3: Expo Go (Test nhanh nhất)

1. Cài **Expo Go** trên điện thoại Android
2. Chạy `npm start`
3. Quét QR code bằng Expo Go app
4. Share link với người khác để họ test

## 📂 Cấu trúc dự án

```
Nightcord/
├── src/
│   ├── components/      # Components UI
│   ├── constants/       # Màu sắc, theme
│   ├── data/            # Mock data
│   └── screens/         # Các màn hình
├── assets/              # Hình ảnh, icons
├── App.js               # Entry point
└── app.json             # Cấu hình Expo
```

## 🎨 Tính năng hiện tại

- ✅ Giao diện giống Discord
- ✅ Chuyển đổi server
- ✅ Chat với mock data
- ✅ Gửi tin nhắn (local state)

## 📝 Lưu ý

- Cần tạo thư mục `assets/` và thêm các file icon, splash screen
- Hoặc tạm thời comment các dòng icon trong `app.json` để build được

