
const {ObjectId} = require("../db");
const fs = require("fs");

const addContact = async (req,res) => {
    const { db, io} = require("../index");
    const {id,username} = req.body;
    try {
        const you = await db.collection("user").findOne({_id : new ObjectId(id)});
        const user = await db.collection("user").findOne({username: username});

        if(!user) {
            res.send({error:"User dosen't exist."})
        } else {

        const contacts = await db.collection("contact").find({ userIds : {$all:[new ObjectId(id), user._id]}}).toArray();

        if(contacts.length !== 0){
            res.send({error:"Already added."})
        }
        const resp = await db.collection("chat").insertOne({
            messages: []
        });

        const chat = await db.collection("chat").findOne({
            _id : resp.insertedId
        });

        const contact =  await db.collection("contact").insertOne({
            userIds: [new ObjectId(id) , user._id],
            users: [you.username, username],
            chat: chat._id,
            lastMessage: {}
        });
        io.to(you.username).emit("newcontact", {
            _id : contact.insertedId,
            user: {
                    username: username,
                    profilePicture: user.profilePicture,
            },
            chat: chat._id,
            lastMessage: {}
        });

        io.to(username).emit("newcontact", {
            _id : contact.insertedId,
            user: {
                    username: you.username,
                    profilePicture: you.profilePicture,
            },
            chat: chat._id,
            lastMessage: {}
        });
         res.send({message: "Done."});
    }
    } catch(e) {
        console.log(e)
    }  
}

const removeContact = async (req,res) => {
    const { db, io } = require("../index");
    const contactId = req.params.id;
    try {
        const contact = await db.collection("contact").findOne({_id : new ObjectId(contactId)});
        const chat = await db.collection("chat").findOne({_id : new ObjectId( contact.chat)});
        const resp = await db.collection("contact").deleteOne({_id : contact._id});
        const resp1 = await db.collection("chat").deleteOne({_id : contact.chat})
        io.to(contactId).emit("removeContact",{contactId: contactId});
        res.send({message: "Done"});
    } catch(e) {
        console.log(e);
    }
}

const getContacts = async (req,res) => {
    const { db, io } = require("../index");
    const id = req.params.id;
    const socketId = req.params.socketId;
    const socket = io.sockets.sockets.get(socketId)
    try {
        const you = await db.collection("user").findOne({_id : new ObjectId(id)});
        const contacts = await db.collection("contact").find({ userIds : {$all:[new ObjectId(id)]}}).toArray();
        console.log(contacts)
        socket.join(you.username);
        contacts.forEach(contact => {
            socket.join(contact._id.toString());
        });
        console.log(socket.rooms);

        res.send( contacts.map(contact => {
            let username = contact.users[1];
            if (username === you.username) {
                username = contact.users[0];
            }
            return  {
                _id: contact._id,
                user: username, 
                chat: contact.chat, 
                lastMessage: contact.lastMessage}
            }));

    } catch(e) {
        console.log(e);
    }
}

const getMessages = async (req,res) => {
    const { db } = require("../index");
    const id = req.params.id;
    try {
        const chat = await db.collection("chat").findOne({_id:  new ObjectId(id)});
        res.send(chat.messages);
    } catch(e) {
        console.log(e)
    }
}

const sendMessage = async (req,res) => {
    const {db,io} = require("../index");
    const {id, message, contactId} = req.body;
    try {
        const contact = await db.collection("contact").findOne({_id : new ObjectId(contactId)});
        const user = await db.collection("user").findOne({_id : new ObjectId(id)});
        let messageObj = {message: message, username: user.username, date : Date.now()}
        await db.collection("chat").updateOne(
            {_id : contact.chat},
            { $push: {messages: messageObj} }
            );

        await db.collection("contact").updateOne(
            {_id : new ObjectId(contactId)},
            {$set: {lastMessage : messageObj}}
        );

        io.to(contactId).emit("message",{_id: contact.chat, messageObj});
        res.send({message: "Done"})
    } catch(e) {
        console.log(e)
    }
}


const changeProfilePicture = async (req, res) => {
    const { db } = require("../index");
    const id = req.body.id;
    try {
        const user = await db.collection("user").findOne({_id : new ObjectId(id)});
        const db_res = await db.collection("files").insertOne(req.file);
        req.file["_id"] = db_res.insertedId;
        console.log(user)
        if (user.profilePicture !== "") {
            const profilePicture = await db.collection("files").findOne({_id : new ObjectId(user.profilePicture)})
            fs.unlink(profilePicture.path, (err) => { 
                if (err)  console.log(err) 
            });
            const resp = await db.collection("files").deleteOne({_id : new ObjectId(user.profilePicture)})
        }
        const resp = await db.collection("user").updateOne(
            {_id : new ObjectId(id)},
            {$set: {profilePicture : db_res.insertedId}}
        );
        console.log(db_res.insertedId)
        res.send({ message: "Successfully uploaded", id:  db_res.insertedId});
    } catch (e) {
        console.log(e);
    }
    
};

const getProfilePicture =  async (req, res) => {
    const { db } = require("../index");
    const username = req.params.id;
    const user = await db.collection("user").findOne({ username : username });
    if(user.profilePicture){
        const pfp = await db.collection("files").findOne({_id : new ObjectId(user.profilePicture)})
        const file = fs.createReadStream(pfp.path)
        res.setHeader('Content-Disposition', 'attachment: filename="' + pfp.originalname + '"')
        file.pipe(res)        
    } else {
        const file = fs.createReadStream("profilePictures/default.jpg")
        res.setHeader('Content-Disposition', 'attachment: filename="' + "default.jpg" + '"')
        file.pipe(res)        
    }
};

module.exports = {addContact,getContacts,sendMessage,getMessages,removeContact, changeProfilePicture, getProfilePicture}