const express = require('express');

const app = express();



// app.use("/", (req, res)=>{
//     res.send("hah haa");
// })
app.get("/user/:userId/:name/:pass", (req, res)=>{
    // console.log(req.query);
    console.log(req.params);
    res.send({firstName: "John"});
})
// app.post("/user", (req, res)=>{
//     res.send("data stored in db successfully");
// })
// app.delete("/user", (req, res)=>{
//     res.send("Hello Deleted successfully");
// })

// app.use("/", (req, res)=>{
//     res.send("Hello World ffa");
// })


app.listen(7777, ()=>{
    console.log('Server is running on port 7777');
});
