const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res)=>{
    // console.log(req.body);
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User created successfully");
    }
    catch(err){
        console.error(err);
        res.status(400).send("user error"+ err.message);
    }
})

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

