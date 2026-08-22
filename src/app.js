const express = require('express');

const app = express();



app.use("/test", (req, res)=>{
    res.send("Hello test");
})
app.use("/secretdata", (req, res)=>{
    res.send("Hello secretdata");
})

app.use("/", (req, res)=>{
    res.send("Hello World ffa");
})


app.listen(7777, ()=>{
    console.log('Server is running on port 7777');
});
