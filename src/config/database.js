const mongoose = require("mongoose");

const connectDB = async () => {
   await mongoose.connect("mongodb+srv://vrutiksurti81_db_user:1wlWobnHVAMNh6DS@matchyou.zvd5xks.mongodb.net/");
};

module.exports = connectDB;