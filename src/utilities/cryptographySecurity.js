const crypto = require("crypto");

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Securely store in .env
const IV_LENGTH = 16;

// Encrypt JWT with AES-256-CBC and HMAC
const encryptToken = (token) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Generate HMAC for authentication
  const hmac = crypto.createHmac("sha256", ENCRYPTION_KEY);
  hmac.update(iv.toString("hex") + encrypted);
  const mac = hmac.digest("hex");

  return `${iv.toString("hex")}:${encrypted}:${mac}`;
};

// Decrypt JWT with verification
const decryptToken = async (encryptedToken) => {
  try {
    const [iv, encrypted, mac] = encryptedToken.split(":");
    const hmac = crypto.createHmac("sha256", ENCRYPTION_KEY);
    hmac.update(iv + encrypted);
    const calculatedMac = hmac.digest("hex");

    if (calculatedMac !== mac) {
      throw new Error("Token integrity check failed.");
    }

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      ENCRYPTION_KEY,
      Buffer.from(iv, "hex")
    );
    // console.log(encrypted);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    // console.log("decrypted ================================");
    // console.log(decrypted);
    return decrypted;
  } catch (error) {
    throw new Error("Invalid or corrupted token.");
  }
};

module.exports = {
  encryptToken,
  decryptToken,
};
