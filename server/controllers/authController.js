
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const signUp = async (req,res) => {
    const { db } = require("../index");


    let {username, password} = req.body;
    if(username === "") {
        res.send({error: "Invalid username."})
    }
    if(password.length < 8) {
        res.send({error: "Password must be at least 8 characters long."})
    }
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password,salt);
    try {
        if(await db.collection("user").findOne({username: username})) {
            res.send({error: "Username already taken."})
        } else {
            const resp = await db.collection("user").insertOne({username, password, profilePicture : ""});
            const user = await db.collection("user").findOne({_id : resp.insertedId});
            token = createToken(resp.insertedId);
            res.send({token : token, _id: resp.insertedId, username: user.username, profilePicture : user.profilePicture});
        }
    } catch(e){
        console.log(e.message);
    }
}

const login = async (req,res) => {
    const { db } = require("../index");

    let {username, password} = req.body;
    try {
        const resp = await db.collection("user").findOne({username: username});
        console.log(resp)
        if(resp && await bcrypt.compare(password,resp.password)) {
            console.log(resp._id)
            token = createToken(resp._id);
            res.send({token, _id: resp._id, username: resp.username, profilePicture : resp.profilePicture});
        } else {
            res.send({error: "Wrong username or password."})
        }
    } catch(e){
        console.log(e)
    }
}

const maxAge = 2*24*60*60;

const createToken = (id) => {
    return  jwt.sign({id},"jako velika tajna 56", {
        expiresIn: maxAge
    });
}

module.exports = {signUp,login};