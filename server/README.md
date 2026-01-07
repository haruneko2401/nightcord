# Nightcord Backend Server

Backend server cho ứng dụng Nightcord với các tính năng authentication.

## Cài đặt

1. Cài đặt dependencies:
```bash
cd server
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cấu hình `.env`:
```
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Lưu ý về email:**
- Nếu sử dụng Gmail, bạn cần tạo App Password: https://support.google.com/accounts/answer/185833
- Hoặc có thể bỏ qua cấu hình email để test (server vẫn hoạt động nhưng không gửi email)

## Chạy server

### Development mode (với auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## API Endpoints

### POST /api/auth/register
Đăng ký tài khoản mới

**Request body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "displayName": "Display Name",
  "month": "01",
  "day": "15",
  "year": "2000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "jwt-token",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name"
  }
}
```

### POST /api/auth/login
Đăng nhập

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "jwt-token",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name"
  }
}
```

### POST /api/auth/forgot-password
Quên mật khẩu - Gửi email reset

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Nếu email tồn tại, chúng tôi đã gửi link reset mật khẩu đến email của bạn"
}
```

### POST /api/auth/reset-password
Đặt lại mật khẩu

**Request body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công"
}
```

### GET /api/auth/verify
Xác thực token (protected route)

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name"
  }
}
```

## Database

Server sử dụng JSON files để lưu trữ dữ liệu:
- `data/users.json` - Danh sách users
- `data/resetTokens.json` - Reset tokens

**Lưu ý:** Trong production, nên sử dụng database thật như MongoDB hoặc PostgreSQL.

## Cấu trúc thư mục

```
server/
├── data/              # Database files (tự động tạo)
│   ├── users.json
│   └── resetTokens.json
├── server.js          # Main server file
├── package.json
├── .env              # Environment variables (không commit)
└── README.md
```

