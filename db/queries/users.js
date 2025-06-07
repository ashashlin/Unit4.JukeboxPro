import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  const sql = `
    INSERT INTO users(
      username,
      password
    )
    VALUES(
      $1,
      $2
    )
    RETURNING id, username;
  `;

  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await db.query(sql, [username, hashedPassword]);

  return rows[0];
}

export async function getUserByUsername(username, password) {
  const sql = `
    SELECT * FROM users
    WHERE username = $1;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username]);

  if (!user) return null;

  // returns true or false
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return null;

  // safer not to return the password
  return {
    id: user.id,
    username: user.username,
  };
}
