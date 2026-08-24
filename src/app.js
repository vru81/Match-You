const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

const app = express();

app.use(express.json()); //json to js obj
app.use(cookieParser()); // to parse cookies from server to clinet back and forth

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

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

