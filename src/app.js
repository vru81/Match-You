require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
const cors = require("cors"); // ADD THIS
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

const app = express();
app.disable('x-powered-by');

const allowedOrigins = [
  "http://localhost:5173",
  "https://match-you-frontend.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(express.json()); //json to js obj
app.use(cookieParser()); // to parse cookies from server to clinet back and forth

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

const PORT = process.env.PORT || 7777;

connectDB()
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

