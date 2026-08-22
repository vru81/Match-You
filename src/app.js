const express = require('express');

const app = express();

app.get("/user", (req, res,next)=>{
    // console.log(req.query);
    // console.log(req.params);
    next();
    console.log("First middleware");
    res.send("Hello from user route 1");
},
[(req, res, next)=>{
    console.log("Second middleware");
    next();
    res.send("Hello from user route 2");
},
(req, res, next)=>{
    console.log("Third middleware");
    res.send("Hello from user route 3");
}])



app.listen(7777, ()=>{
    console.log('Server is running on port 7777');
});
