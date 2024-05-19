const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const authRoutes = require("./routes/authRoutes")
const messengerRoutes = require("./routes/messengerRoutes")


const { connect_to_db} = require("./db");


const port = 3000;

let app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, { 
    cors: {
        origin: `*`
      }
});

(async () => {
    let db;
    try {
        db = await connect_to_db();
    } catch(e) {
        console.log(e);
    }
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(__dirname + '/profilePictures'));
    app.use(authRoutes);
    app.use(messengerRoutes);

    io.on("connection", (socket) => { 
        console.log("connected")
        socket.on('join',data => {
            socket.join(data._id);
        })
    })
    
    httpServer.listen(port, () => {
        console.log(`Server is listening at ${port}`);
    });
    module.exports = {db,io};
})()
