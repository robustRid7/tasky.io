const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL_DEV = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { PORT, MONGO_URL_DEV, JWT_SECRET };
