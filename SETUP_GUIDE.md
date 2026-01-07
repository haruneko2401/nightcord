# Hướng dẫn thiết lập Backend và Frontend

## Bước 1: Thiết lập Backend Server

1. **Cài đặt dependencies cho backend:**
```bash
cd server
npm install
```

2. **Tạo file `.env`:**
```bash
# Trong thư mục server, tạo file .env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Lưu ý về email:**
- Email là tùy chọn. Nếu không cấu hình, server vẫn hoạt động nhưng không gửi email reset password.
- Nếu dùng Gmail, cần tạo App Password: https://support.google.com/accounts/answer/185833

3. **Chạy backend server:**
```bash
cd server
npm start
# hoặc cho development với auto-reload:
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

## Bước 2: Thiết lập Frontend

1. **Cài đặt dependencies cho frontend:**
```bash
# Ở thư mục gốc của project
npm install
```

2. **Cấu hình API URL cho React Native:**

Mở file `src/services/api.js` và thay `YOUR_IP_ADDRESS` bằng IP máy tính của bạn:

**Tìm IP của bạn:**
- **Windows:** Mở Command Prompt và chạy `ipconfig`, tìm "IPv4 Address"
- **Mac/Linux:** Mở Terminal và chạy `ifconfig` hoặc `ip addr`, tìm IP address

**Ví dụ:**
```javascript
const API_BASE_URL = __DEV__ 
  ? (Platform.OS === 'web' 
      ? 'http://localhost:3000/api' 
      : 'http://192.168.1.100:3000/api') // Thay bằng IP của bạn
  : 'https://your-production-api.com/api';
```

3. **Chạy frontend:**
```bash
npm start
```

## Bước 3: Kiểm tra kết nối

1. **Backend đang chạy:** Mở browser và truy cập `http://localhost:3000/api/health`
   - Nếu thấy `{"status":"OK","message":"Server is running"}` là thành công

2. **Frontend kết nối backend:**
   - Mở app và thử đăng ký/đăng nhập
   - Kiểm tra console để xem có lỗi kết nối không

## Troubleshooting

### Lỗi "Network request failed" trên React Native:
- Đảm bảo backend đang chạy
- Kiểm tra IP address trong `src/services/api.js` đã đúng chưa
- Đảm bảo điện thoại và máy tính cùng mạng WiFi
- Thử tắt firewall tạm thời

### Lỗi CORS:
- Backend đã cấu hình CORS, nếu vẫn lỗi, kiểm tra lại cấu hình

### Email không gửi được:
- Kiểm tra cấu hình SMTP trong `.env`
- Với Gmail, cần bật "Less secure app access" hoặc dùng App Password
- Có thể bỏ qua email để test (server vẫn hoạt động)

## Cấu trúc Project

```
nightcord/
├── server/                 # Backend server
│   ├── data/              # Database files (tự động tạo)
│   ├── server.js          # Main server
│   ├── package.json
│   └── .env              # Environment variables
├── src/
│   ├── screens/          # Login, Register, ForgotPassword screens
│   ├── services/
│   │   └── api.js        # API service
│   └── ...
├── App.js                # Main app
└── package.json
```

## API Endpoints

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `GET /api/auth/verify` - Xác thực token

Xem chi tiết trong `server/README.md`

