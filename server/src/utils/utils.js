const { genSalt, compare, hash } = require("bcrypt");
require("dotenv").config();

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

async function verifyPassword(password, storedHashedPassword) {
  try {
    const match = await compare(password, storedHashedPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

const admin = require("firebase-admin");

const firebaseServiceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  client_x509_cert_url: process.env.CLIENT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  storageBucket: "gs://yumhub-d8edd.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { verifyPassword, hashPassword, bucket };
