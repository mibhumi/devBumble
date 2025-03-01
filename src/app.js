console.log("starting a new project");

const express = require("express");

const app = express();

// request handler
app.use("/test", (req,res) => {
    res.send("Hello from the server");
});

app.listen(3001, ()=>{console.log("Server is listening on port number 3001");});