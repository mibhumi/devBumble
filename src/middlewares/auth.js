//auth route
const adminAuth = (req,res) => {
    console.log("inside admin auth");
    const token = "12345";
    if(token === "56") {
        next();
    } else {
        res.status(401).send("bad request. auth didn't match");
    }
};

module.exports = { adminAuth };