const path = require("path");
const fs = require("fs");


const getImageService = (filename) => {
  const imagePath = filename//path.join(__dirname, "../uploads", filename); 
  console.log(imagePath)
  if (!fs.existsSync(imagePath)) {
    throw new Error("Image not found!");
  }

  return imagePath;
};

module.exports = { getImageService };
