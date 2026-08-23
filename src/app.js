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

// get user by mail 
app.get("/user", async (req, res)=>{
    const emailId = req.body.emailId;

    try{
        const user = await User.find({emailId: emailId});
        if(user.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        console.error(err);
        res.status(400).send("Something went wrong: " + err.message);
    }
})

// get feed api
app.get("/feed", async (req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        console.error(err);
        res.status(400).send("Something went wrong: " + err.message);
    }
})

app.delete('/user',async (req, res) =>{
    const userId = req.body.userId; 
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch(err){ 
        console.log(err);
        res.status(400).send("Something went wrong: " + err.message);
    }
});

app.patch('/user', async (req, res) =>{
    const userId = req.body.userId;
    const data = req.body;

    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every(
            (key) => key === "userId" || ALLOWED_UPDATES.includes(key)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed on these fields");
        }

        const user = await User.findByIdAndUpdate(userId, data,{
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User updated successfully");
    }
    catch(err){
        console.log(err);
        res.status(400).send("Something went wrong: " + err.message);
    }
});

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

