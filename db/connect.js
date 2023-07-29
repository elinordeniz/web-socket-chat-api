const mongoose = require("mongoose");

const connectDB = async (url) => {
   console.log("connect db")
  return await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
