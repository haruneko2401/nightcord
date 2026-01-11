const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../config/env');

// Create connection pool
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        throw error;
    }
}

// User DAL
async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0];
}

async function findUserByUsername(username) {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    return rows[0];
}

async function findUserById(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    return rows[0];
}

async function createUser(user) {
    const { username, email, displayName, password, dateOfBirth } = user;
    // Note: dateOfBirth object needs to be converted to DATE string 'YYYY-MM-DD'
    const dob = `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`;

    const [result] = await pool.execute(
        'INSERT INTO users (username, email, display_name, password_hash, date_of_birth) VALUES (?, ?, ?, ?, ?)',
        [username, email, displayName, password, dob] // password here is already hashed
    );

    return { ...user, id: result.insertId };
}

async function updateUserPassword(userId, hashedPassword) {
    await pool.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hashedPassword, userId]
    );
}

// Token DAL
async function createResetToken(userId, token, expiresAt) {
    await pool.execute(
        'INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
    );
}

async function findResetToken(token) {
    const [rows] = await pool.execute(
        'SELECT * FROM reset_tokens WHERE token = ? AND is_used = FALSE AND expires_at > NOW()',
        [token]
    );
    return rows[0];
}

async function markTokenAsUsed(tokenId) {
    await pool.execute(
        'UPDATE reset_tokens SET is_used = TRUE WHERE id = ?',
        [tokenId]
    );
}

// Server DAL
async function createServer(server) {
    const { name, ownerId, type, icon } = server;
    const [result] = await pool.execute(
        'INSERT INTO servers (name, owner_id, type, icon) VALUES (?, ?, ?, ?)',
        [name, ownerId, type, icon]
    );
    return result.insertId;
}

async function addServerMember(serverId, userId) {
    await pool.execute(
        'INSERT INTO server_members (server_id, user_id) VALUES (?, ?)',
        [serverId, userId]
    );
}

async function getUserServers(userId) {
    const [rows] = await pool.execute(`
    SELECT s.* FROM servers s
    JOIN server_members sm ON s.id = sm.server_id
    WHERE sm.user_id = ?
  `, [userId]);
    return rows;
}

async function getServerById(serverId) {
    const [rows] = await pool.execute(
        'SELECT * FROM servers WHERE id = ?',
        [serverId]
    );
    return rows[0];
}

async function isServerMember(serverId, userId) {
    const [rows] = await pool.execute(
        'SELECT * FROM server_members WHERE server_id = ? AND user_id = ?',
        [serverId, userId]
    );
    return rows.length > 0;
}

// Channel DAL
async function createChannel(channel) {
    const { serverId, name, type } = channel;
    const [result] = await pool.execute(
        'INSERT INTO channels (server_id, name, type) VALUES (?, ?, ?)',
        [serverId, name, type]
    );
    return result.insertId;
}

async function getServerChannels(serverId) {
    const [rows] = await pool.execute(
        'SELECT * FROM channels WHERE server_id = ?',
        [serverId]
    );
    return rows;
}

// Message DAL
async function createMessage(message) {
    const { channelId, userId, content } = message;
    const [result] = await pool.execute(
        'INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)',
        [channelId, userId, content]
    );
    return result.insertId;
}

async function getChannelMessages(channelId) {
    const [rows] = await pool.execute(`
    SELECT m.*, u.username, u.display_name as user, u.id as userId
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.channel_id = ?
    ORDER BY m.created_at ASC
  `, [channelId]);

    // Format for frontend
    return rows.map(row => ({
        id: row.id,
        channelId: row.channel_id,
        userId: row.user_id,
        user: row.user,
        username: row.username,
        avatar: `https://i.pravatar.cc/100?img=${parseInt(row.user_id) % 50}`,
        content: row.content,
        time: row.created_at.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: row.created_at
    }));
}

// Typing State (In-Memory for now as discussed)
// We can reuse the JSON logic or simple in-memory object 
// Since JSON persistence is removed, we'll use a simple global object module
// But since this file replaces db.js, we need to export something.

const typingState = {};

async function readTypingState() {
    return typingState;
}

async function writeTypingState(newState) {
    Object.assign(typingState, newState);
}

// Re-export legacy/compat functions if needed or just new ones
module.exports = {
    initDatabase,
    pool, // Export pool if raw queries needed
    findUserByEmail,
    findUserByUsername,
    findUserById,
    createUser,
    updateUserPassword,
    createResetToken,
    findResetToken,
    markTokenAsUsed,
    createServer,
    addServerMember,
    getUserServers,
    getServerById,
    isServerMember,
    createChannel,
    getServerChannels,
    createMessage,
    getChannelMessages,
    readTypingState,
    writeTypingState
};
