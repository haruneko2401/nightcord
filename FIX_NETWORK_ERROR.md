# Cách sửa lỗi "Network request failed"

Lỗi này xảy ra khi frontend không thể kết nối đến backend server. Hãy làm theo các bước sau:

## Bước 1: Kiểm tra Backend Server

1. **Mở terminal mới** và chạy:
```bash
cd server
npm install
npm start
```

2. **Kiểm tra server đang chạy:**
   - Mở browser và truy cập: `http://localhost:3000/api/health`
   - Nếu thấy `{"status":"OK","message":"Server is running"}` → Backend đang chạy ✅
   - Nếu không → Backend chưa chạy, cần chạy lại

## Bước 2: Cấu hình API URL

### Nếu chạy trên Web (localhost:8082):
- Không cần làm gì, đã được cấu hình sẵn cho `localhost:3000`

### Nếu chạy trên React Native (Android/iOS):
1. **Tìm IP address của máy tính:**
   - **Windows:** Mở Command Prompt, chạy `ipconfig`, tìm "IPv4 Address"
   - **Mac/Linux:** Mở Terminal, chạy `ifconfig` hoặc `ip addr`, tìm IP address
   - Ví dụ: `192.168.1.100`

2. **Cập nhật file `src/services/api.js`:**
   - Mở file `src/services/api.js`
   - Tìm dòng: `'http://YOUR_IP_ADDRESS:3000/api'`
   - Thay `YOUR_IP_ADDRESS` bằng IP của bạn
   - Ví dụ: `'http://192.168.1.100:3000/api'`

3. **Lưu file và restart app**

## Bước 3: Kiểm tra Firewall

- Đảm bảo firewall không chặn port 3000
- Nếu cần, tạm thời tắt firewall để test

## Bước 4: Kiểm tra kết nối

- Đảm bảo điện thoại và máy tính cùng một mạng WiFi (nếu dùng React Native)
- Thử ping IP address từ điện thoại

## Lưu ý

- Backend phải chạy trước khi mở frontend
- Nếu đổi IP, cần restart cả backend và frontend
- Trên web, luôn dùng `localhost:3000`
- Trên mobile, phải dùng IP address thật của máy tính

## Test nhanh

Sau khi cấu hình xong, thử:
1. Mở app
2. Thử đăng ký hoặc đăng nhập
3. Nếu vẫn lỗi, kiểm tra console để xem thông báo lỗi chi tiết

