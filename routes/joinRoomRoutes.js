const express = require("express");

const router = express.Router();

const Game = require("../models/game");

let player2Name = "";
let player1Name = "";
let databaseID = "";
let gameID = "";
let allDetails=[];
let roomID = "";

router.post("/player-name-page", (req, res) => {
    res.render("player-name-page");
});

router.get("/render/player-name-page",(req,res)=>{
    const buttonContent = {
        content: "JoinRoom",
        location: "/joinRoom/room-id-enter-page"
    };
    res.render("player-name-page", { "buttonContent":buttonContent });
})

router.post("/room-id-enter-page",(req,res)=>{

   player2Name= req.body.player2Name;
   res.render("room-id-enter-page",{"ErrorFlag":false});
})

router.get("/render/room-id-enter-page",(req,res)=>{
    res.render("room-id-enter-page",{
        "ErrorFlag":false,
        
    })
})

router.post("/room-id-check", async (req, res) => {
    roomID = parseInt(req.body.roomID, 10);
    let currGame = await Game.find({ roomID });

    if (currGame.length === 1) {
        databaseID = currGame[0]._id;
        player1Name = currGame[0].player1Name;

        // Update player2Name in the database
        await Game.findByIdAndUpdate(databaseID, { player2Name });

        // Send JSON response indicating success
        res.status(200).json({ redirectTo: "/joinRoom/render/player-waiting-page" });
    } else {
        // Send JSON response indicating failure
        res.status(404).json({ error: "Room not found" });
    }
});

router.get("/render/player-waiting-page", (req, res) => {
    const playerName = [player2Name, player1Name];

    res.render("player-waiting-page", {
        RoomID: roomID,
        playerName: playerName,
        loaderFlag: false,
        startButtonFlag: false,
    });
});


router.get("/game-start-check", async (req, res) => {
    try {
        const savedGame = await Game.findById(databaseID);

        if (!savedGame) {
            return res.status(404).json({ error: "Game not found" });
        }

        if (savedGame.gameStart === "no") {
            return res.status(404).json({ error: "Game has not started" });
        }

        res.status(200).json({ success: true, message: "Game has started" });
    } catch (error) {
        console.error("Error checking game start status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
