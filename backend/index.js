const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./src/config/db.config");
const { PORT } = require("./src/config/config.variables");
const routes = require("./src/routes"); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/tasks/api", routes);

dbConnection();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// sauz imcj plzl alol