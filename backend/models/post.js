const db = require("../database");

class Post {
  constructor({ id, title, content, imagePath }) {
    this.id = id ? String(id) : undefined;
    this.title = title;
    this.content = content;
    this.imagePath = imagePath;
  }

  async save() {
    const result = await db.run(
      "INSERT INTO posts (title, content, image_path) VALUES (?, ?, ?)",
      [this.title, this.content, this.imagePath]
    );

    return {
      _id: String(result.lastID),
      title: this.title,
      content: this.content,
      imagePath: this.imagePath
    };
  }

  static async updateOne(filter, post) {
    const result = await db.run(
      "UPDATE posts SET title = ?, content = ?, image_path = ? WHERE id = ?",
      [post.title, post.content, post.imagePath, filter._id]
    );

    return result;
  }

  static async find(pageSize, currentPage) {
    let sql = "SELECT id, title, content, image_path FROM posts ORDER BY id DESC";
    const params = [];

    if (pageSize && currentPage) {
      sql += " LIMIT ? OFFSET ?";
      params.push(pageSize, pageSize * (currentPage - 1));
    }

    const rows = await db.all(sql, params);
    return rows.map((row) => ({
      _id: String(row.id),
      title: row.title,
      content: row.content,
      imagePath: row.image_path
    }));
  }

  static async countDocuments() {
    const row = await db.get("SELECT COUNT(*) AS count FROM posts");
    return row ? row.count : 0;
  }

  static async findById(id) {
    const row = await db.get(
      "SELECT id, title, content, image_path FROM posts WHERE id = ?",
      [id]
    );

    if (!row) {
      return null;
    }

    return {
      _id: String(row.id),
      title: row.title,
      content: row.content,
      imagePath: row.image_path
    };
  }

  static async deleteOne(filter) {
    return db.run("DELETE FROM posts WHERE id = ?", [filter._id]);
  }
}

module.exports = Post;
