const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const RESET_PASSWORD_TOKEN_EXPIRY = "15m";

module.exports = {
    JWT_SECRET,
    RESET_PASSWORD_TOKEN_EXPIRY
};