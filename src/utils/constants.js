// Centralized secrets/config so they aren't duplicated across files.
const JWT_SECRET = process.env.JWT_SECRET || "MatchYou";
const RESET_PASSWORD_TOKEN_EXPIRY = "15m";

module.exports = { JWT_SECRET, RESET_PASSWORD_TOKEN_EXPIRY };
