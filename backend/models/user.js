const db = require("../database");

class User {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  async save() {
    const result = await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [this.email, this.password]
    );

    return {
      _id: String(result.lastID),
      email: this.email,
      password: this.password
    };
  }

  static async findOne(filter) {
    const row = await db.get(
      "SELECT id, email, password FROM users WHERE email = ?",
      [filter.email]
    );

    if (!row) {
      return null;
    }

    return {
      _id: String(row.id),
      email: row.email,
      password: row.password
    };
  }
}

module.exports = User;
