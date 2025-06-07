import jwt from "jsonwebtoken";

const SECRET = process.env.ACCESS_TOKEN_SECRET;

/** Creates a token with the given payload */
export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/** Extracts the payload from a token */
// returns the payload object if valid, throws an error if invalid
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
