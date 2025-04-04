const mongoose = require("mongoose");
const { MONGO_URL_DEV } = require("./config.variables");

const dbConnection = async () => {
    try {
        await mongoose.connect(MONGO_URL_DEV, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Error in DB connection:", error);
    }
};

module.exports = { dbConnection };
