console.log("starting a new project");

const { query } = require("express");
const express = require("express");
const { adminAuth } = require("./middlewares/auth");

const app = express();

//admin auth
app.use("/admin", adminAuth, (req,res)=>{res.send("hello 2nd");});

// request handler
app.use("/test", (req,res, next) => {
    console.log(req.query);
   // res.send({name: "Bhumi"});
    next();
},
(req, res)=>{
    console.log("next called");
   res.send("successfully calling next");
}
);

app.use("/home/:id", (req,res) => {
    console.log(req.params);
    res.send("Welcome to Home");
});

app.use("/", (req,res) => {
    res.send("Hello Bhumi");
});

app.listen(3001, ()=>{console.log("Server is listening on port number 3001");});