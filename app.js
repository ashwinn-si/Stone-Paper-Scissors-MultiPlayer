const express = require("express");
const app = express();
const {router:createRoomRoutes , allDetails:allDetails1} = require("./routes/createRoomRoutes");
const {router:joinRoomRoutes , allDetails:allDetails2} = require("./routes/joinRoomRoutes");
const player1Routers = require("./routes/player1Routes");
const player2Routers = require("./routes/player2Routes");
const path = require("path");
const https = require("http");
const PORT = 3000;
const {Server} = require("socket.io");

const server = https.createServer(app);

const io = new Server(server);


//socket-io connections
io.on("connection", (socket) => {
    socket.on("Player1joinRoom", (room) => {
        socket.join(room);
    })
    socket.on("Player2joinRoom", (room) => {    
        // Try to join the room
        socket.join(room, (err) => {
            if (err) {
                console.log(`Error joining room: ${room}`, err);
                return;
            }
            // Successfully joined room
            allDetails1.player2Name = allDetails2.player2Name;
            io.to(room).emit("player-2-Joined-Room", allDetails2.player2Name);
            console.log(`Socket successfully joined room: ${room}`);
        });
    });
    socket.on("gameStarted",(room)=>{
        io.to(room).emit("game-started");
    })
})


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("create-join-room-page");
});

app.use("/createRoom",createRoomRoutes);

app.use("/joinRoom",joinRoomRoutes);

app.use("/player1",player1Routers);

app.use("/player2",player2Routers);

app.get("/return-home",(req,res)=>{
    res.render("create-join-room-page")
})

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});