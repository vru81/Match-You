const express = require('express');

const app = express();

const { adminAuth,userAuth } = require("./middlewares/auth");



app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) =>{
    res.send("User data send succesfully");
});
app.get("/user/getAllData", userAuth, (req, res) =>{
    res.send("User data send succesfully");
});
app.get("/user/deleteData", userAuth, (req, res) =>{
    res.send("All Data deleted succesfully");
});
app.get("/admin/getAllData", (req, res)=>{
    res.send("All Data Send succesfully");
});
app.get("/admin/deleteData", (req, res)=>{
    res.send("All Data deleted succesfully");
});

app.use("/", (err,req, res,next)=>{
    res.status(404).send("Route not found");
})

app.listen(7777, ()=>{
    console.log('Server is running on port 7777');
});
