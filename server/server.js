const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Database file path
const DB_PATH = path.join(__dirname, 'data', 'users.json');
const RESET_TOKENS_PATH = path.join(__dirname, 'data', 'resetTokens.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Initialize database files
async function initDatabase() {
  await ensureDataDir();
  
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
  }
  
  try {
    await fs.access(RESET_TOKENS_PATH);
  } catch {
    await fs.writeFile(RESET_TOKENS_PATH, JSON.stringify([], null, 2));
  }
}

// Read users from database
async function readUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write users to database
async function writeUsers(users) {
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

// Read reset tokens
async function readResetTokens() {
  try {
    const data = await fs.readFile(RESET_TOKENS_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write reset tokens
async function writeResetTokens(tokens) {
  await fs.writeFile(RESET_TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

// Email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Helper function to send email
async function sendResetEmail(email, resetToken) {
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_USER || 'noreply@nightcord.com',
    to: email,
    subject: 'Reset Your Nightcord Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5865F2;">Nightcord Password Reset</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #5865F2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, displayName, month, day, year } = req.body;

    // Validation
    if (!email || !username || !password || !month || !day || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không hợp lệ' 
      });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Username validation
    if (username.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username phải có ít nhất 3 ký tự' 
      });
    }

    const users = await readUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email đã được sử dụng' 
      });
    }

    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username đã được sử dụng' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      displayName: displayName || username,
      password: hashedPassword,
      dateOfBirth: {
        month,
        day,
        year,
      },
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server. Vui lòng thử lại sau' 
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập email và mật khẩu' 
      });
    }

    const users = await readUsers();

    // Find user by email or username
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() || 
           u.username.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email/Username hoặc mật khẩu không đúng' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email/Username hoặc mật khẩu không đúng' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server. Vui lòng thử lại sau' 
    });
  }
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập email' 
      });
    }

    const users = await readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Save reset token
      const resetTokens = await readResetTokens();
      resetTokens.push({
        token: resetToken,
        userId: user.id,
        email: user.email,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        used: false,
      });
      await writeResetTokens(resetTokens);

      // Send email
      await sendResetEmail(user.email, resetToken);
    }

    res.json({
      success: true,
      message: 'Nếu email tồn tại, chúng tôi đã gửi link reset mật khẩu đến email của bạn',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server. Vui lòng thử lại sau' 
    });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp token và mật khẩu mới' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }

    // Check reset token in database
    const resetTokens = await readResetTokens();
    const resetTokenData = resetTokens.find(
      rt => rt.token === token && !rt.used && new Date(rt.expiresAt) > new Date()
    );

    if (!resetTokenData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token không hợp lệ hoặc đã được sử dụng' 
      });
    }

    // Update user password
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === resetTokenData.userId);

    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Người dùng không tồn tại' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    await writeUsers(users);

    // Mark token as used
    resetTokenData.used = true;
    await writeResetTokens(resetTokens);

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server. Vui lòng thử lại sau' 
    });
  }
});

// Verify token endpoint (for protected routes)
app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không có token' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await readUsers();
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Người dùng không tồn tại' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token không hợp lệ' 
    });
  }
});

// Typing indicator endpoint
app.post('/api/chat/typing', async (req, res) => {
  try {
    const { channelId, userId, username, isTyping } = req.body;
    
    if (!channelId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Channel ID và User ID là bắt buộc',
      });
    }

    // Lưu typing state (trong production nên dùng Redis hoặc database)
    // Tạm thời chỉ return success
    res.json({
      success: true,
      message: isTyping ? 'Đang soạn...' : 'Đã dừng soạn',
    });
  } catch (error) {
    console.error('Typing indicator error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
});

// Get typing users in a channel
app.get('/api/chat/typing/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    
    // Trong production, lấy từ database/Redis
    // Tạm thời return empty array
    res.json({
      success: true,
      typingUsers: [],
    });
  } catch (error) {
    console.error('Get typing users error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
});

// Create server/room endpoint
app.post('/api/servers/create', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }

    const { name, type } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên server không được để trống',
      });
    }

    // Tạo server mới
    const newServer = {
      id: Date.now().toString(),
      name: name.trim(),
      type: type || 'community',
      ownerId: decoded.userId,
      createdAt: new Date().toISOString(),
      members: [decoded.userId],
    };

    // Lưu server (trong production nên lưu vào database)
    // Tạm thời chỉ return server data
    res.status(201).json({
      success: true,
      message: 'Tạo server thành công',
      server: newServer,
    });
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.SMTP_USER ? 'Configured' : 'Not configured (using mock)'}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

