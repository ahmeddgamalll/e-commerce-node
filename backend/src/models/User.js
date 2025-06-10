const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(name, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;
