const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const { JWT_SECRET } = require('../config/env');
const { sendResetEmail } = require('../utils/email');

async function register(req, res) {
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

        // Check if email already exists
        const existingEmail = await db.findUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Check if username already exists
        const existingUsername = await db.findUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username đã được sử dụng'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await db.createUser({
            email,
            username,
            displayName: displayName || username,
            password: hashedPassword,
            dateOfBirth: { month, day, year }
        });

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
                displayName: newUser.display_name || newUser.displayName,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server. Vui lòng thử lại sau'
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập email và mật khẩu'
            });
        }

        // Find user by email or username
        // Check if input is email format
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        let user;

        if (isEmail) {
            user = await db.findUserByEmail(email);
        } else {
            user = await db.findUserByUsername(email);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email/Username hoặc mật khẩu không đúng'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

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
                displayName: user.display_name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server. Vui lòng thử lại sau'
        });
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập email'
            });
        }

        const user = await db.findUserByEmail(email);

        if (user) {
            // Generate reset token
            const resetToken = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Save reset token
            const expiresAt = new Date(Date.now() + 3600000); // 1 hour
            await db.createResetToken(user.id, resetToken, expiresAt);

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
}

async function resetPassword(req, res) {
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

        // Verify token structure
        try {
            jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        // Check reset token in database
        const resetTokenData = await db.findResetToken(token);

        if (!resetTokenData) {
            return res.status(400).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã được sử dụng'
            });
        }

        // Update user password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.updateUserPassword(resetTokenData.user_id, hashedPassword);

        // Mark token as used
        await db.markTokenAsUsed(resetTokenData.id);

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
}

async function verify(req, res) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không có token'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.findUserById(decoded.userId);

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
                displayName: user.display_name,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    verify,
};
