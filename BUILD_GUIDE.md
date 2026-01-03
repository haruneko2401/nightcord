# 🚀 Hướng dẫn Build App cho Nightcord (Android & iOS)

---

# 📱 ANDROID

## ⚡ Cách nhanh nhất: EAS Build (Khuyến nghị)

### Bước 1: Cài đặt và đăng nhập
```bash
# Cài EAS CLI
npm install -g eas-cli

# Đăng nhập Expo (tạo account miễn phí tại expo.dev)
eas login
```

### Bước 2: Cấu hình build

**Nếu chưa có Git:** File `eas.json` đã được tạo sẵn, bạn có thể bỏ qua bước này.

**Nếu đã có Git:** Chạy để tùy chỉnh (tùy chọn):
```bash
eas build:configure
```

### Bước 3: Build APK

**Trên PowerShell (nếu chưa có Git):**
```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile preview
```

**Hoặc nếu đã có Git:**
```bash
eas build --platform android --profile preview
```

### Bước 4: Chờ build và tải APK
- Build sẽ mất khoảng 10-15 phút
- Khi xong, bạn sẽ nhận được link tải APK
- **Share link này cho người khác để test!**

---

## 🔧 Cách 2: Build local (Cần Android Studio)

### Yêu cầu:
- Android Studio đã cài đặt
- Java JDK 11+
- Android SDK

### Các bước:

```bash
# 1. Cài dependencies
npm install

# 2. Prebuild (tạo native code)
npx expo prebuild --platform android

# 3. Build APK
cd android
./gradlew assembleRelease

# 4. Tìm APK tại:
# android/app/build/outputs/apk/release/app-release.apk
```

**Trên Windows:**
```bash
cd android
gradlew.bat assembleRelease
```

---

## 📱 Cách 3: Test với Expo Go (Nhanh nhất, không cần build)

1. **Cài Expo Go** trên điện thoại Android (từ Google Play)
2. **Chạy dự án:**
   ```bash
   npm install
   npm start
   ```
3. **Quét QR code** bằng Expo Go app
4. **Share link** với người khác để họ test (họ cũng cần Expo Go)

---

## ⚠️ Lưu ý quan trọng

1. **Lần đầu build:** Có thể mất 15-20 phút
2. **EAS Build miễn phí:** Có giới hạn số lần build/tháng, nhưng đủ để test
3. **APK size:** Khoảng 30-50MB
4. **Cài đặt APK:** Người test cần bật "Cài đặt từ nguồn không xác định" trong Settings

---

## 🎯 Khuyến nghị cho Android

- **Test nhanh:** Dùng Expo Go (Cách 3)
- **Test thực tế:** Dùng EAS Build (Cách 1) - Dễ nhất, không cần setup phức tạp
- **Build nhiều lần:** Dùng Local Build (Cách 2) - Cần setup nhưng không giới hạn

---

# 🍎 iOS

## ⚡ Cách 1: Test với Expo Go (Miễn phí, nhanh nhất)

1. **Cài Expo Go** trên iPhone/iPad (từ App Store)
2. **Chạy dự án:**
   ```bash
   npm install
   npm start
   ```
3. **Quét QR code** bằng Camera app (iOS 11+) hoặc Expo Go app
4. **Share link** với người khác để họ test (họ cũng cần Expo Go)

**Lưu ý:** Cả bạn và người test phải cùng mạng WiFi hoặc dùng tunnel (Expo tự động tạo).

---

## 🚀 Cách 2: EAS Build cho iOS

### Yêu cầu:
- **Apple Developer Account** ($99/năm) - Để phân phối qua TestFlight/App Store
- **Hoặc Apple ID cá nhân** (miễn phí) - Chỉ test trên thiết bị của bạn

### Bước 1: Cài đặt và đăng nhập
```bash
# Cài EAS CLI (nếu chưa có)
npm install -g eas-cli

# Đăng nhập Expo
eas login
```

### Bước 2: Cấu hình build
```bash
eas build:configure
```

Chọn:
- **iOS** → Yes
- **Build profile** → Chọn `preview` (để test) hoặc `production` (để App Store)

### Bước 3: Build iOS App

#### Option A: Development Build (Miễn phí với Apple ID cá nhân)
```bash
# Build development build (chỉ test trên thiết bị của bạn)
eas build --platform ios --profile development
```

#### Option B: Preview Build (Cần Apple Developer Account)
```bash
# Build preview để test qua TestFlight
eas build --platform ios --profile preview
```

### Bước 4: Cài đặt trên thiết bị

**Với Development Build:**
- Tải file `.ipa` từ link EAS cung cấp
- Cài qua Xcode hoặc Apple Configurator
- Hoặc dùng `eas build:run` để cài tự động

**Với Preview Build:**
- EAS tự động upload lên TestFlight
- Thêm testers vào TestFlight
- Testers nhận email và cài qua TestFlight app

---

## 🔧 Cách 3: Build local với Xcode (Cần Mac)

### Yêu cầu:
- **Mac** với macOS
- **Xcode** (từ App Store)
- **Apple Developer Account** hoặc Apple ID cá nhân
- **CocoaPods** (`sudo gem install cocoapods`)

### Các bước:

```bash
# 1. Cài dependencies
npm install

# 2. Prebuild (tạo native code)
npx expo prebuild --platform ios

# 3. Cài CocoaPods dependencies
cd ios
pod install
cd ..

# 4. Mở Xcode
npx expo run:ios

# Hoặc mở thủ công:
# open ios/Nightcord.xcworkspace
```

### Build trong Xcode:
1. Chọn thiết bị hoặc simulator
2. Product → Archive (cho thiết bị thật)
3. Distribute App → Development/Ad Hoc/App Store

---

## 📋 So sánh các cách cho iOS

| Cách | Chi phí | Thời gian | Phân phối | Khuyến nghị |
|------|---------|-----------|-----------|-------------|
| **Expo Go** | Miễn phí | Ngay lập tức | Chỉ test, không phân phối | ✅ Test nhanh |
| **EAS Development** | Miễn phí* | 15-20 phút | Thiết bị của bạn | ✅ Test thực tế |
| **EAS Preview** | $99/năm | 20-30 phút | TestFlight | ✅ Test với nhiều người |
| **Local Build** | $99/năm | 30-60 phút | Tùy chọn | ⚙️ Tùy chỉnh cao |

*Miễn phí với Apple ID cá nhân, nhưng chỉ test trên thiết bị của bạn. Cần Apple Developer Account để test với nhiều người.

---

## ⚠️ Lưu ý quan trọng cho iOS

1. **Apple Developer Account:**
   - **$99/năm** - Cần để phân phối qua TestFlight/App Store
   - **Miễn phí** - Chỉ test trên thiết bị của bạn (Apple ID cá nhân)

2. **TestFlight:**
   - Miễn phí với Apple Developer Account
   - Tối đa 10,000 testers
   - Build hết hạn sau 90 ngày

3. **Development Build:**
   - Miễn phí với Apple ID cá nhân
   - Chỉ cài được trên thiết bị của bạn
   - Cần kết nối máy tính để cài (hoặc dùng EAS)

4. **Build time:** iOS build thường mất 20-30 phút (lâu hơn Android)

---

## 🎯 Khuyến nghị cho iOS

- **Test nhanh:** Dùng Expo Go (Cách 1) - Miễn phí, ngay lập tức
- **Test thực tế (1 người):** EAS Development Build - Miễn phí với Apple ID
- **Test với nhiều người:** EAS Preview + TestFlight - Cần $99/năm nhưng chuyên nghiệp nhất
- **Tùy chỉnh cao:** Local Build với Xcode - Cần Mac và setup phức tạp

---

## 🔄 Build cả Android và iOS cùng lúc

```bash
# Build cả 2 platform
eas build --platform all --profile preview
```

Lưu ý: iOS build sẽ yêu cầu Apple Developer credentials nếu chưa setup.

