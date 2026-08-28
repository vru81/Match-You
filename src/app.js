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

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json()); //json to js obj
app.use(cookieParser()); // to parse cookies from server to clinet back and forth

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB()
    .then(()=>{
        console.log("Database connected successfully");
        app.listen(7777, () => {
            console.log('Server is running on port 7777');
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

