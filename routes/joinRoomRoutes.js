const express = require("express");

const router = express.Router();

const Game = require("../models/game");

let allDetails ={
    roomID : "",
    databaseID : "",
    player1Name : "",
    player2Name : "",
    totalRounds : "",
}

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

   allDetails.player2Name= req.body.player2Name;
   res.render("room-id-enter-page",{"ErrorFlag":false});
})

router.get("/render/room-id-enter-page",(req,res)=>{
    res.render("room-id-enter-page",{
        "ErrorFlag":false,
    })
})

router.post("/room-id-check", async (req, res) => {
    allDetails.roomID = parseInt(req.body.roomID, 10);
    let currGame = await Game.find({ roomID:allDetails.roomID });

    if (currGame.length === 1) {
        allDetails.databaseID = currGame[0]._id;
        allDetails.player1Name = currGame[0].player1Name;
        allDetails.totalRounds=currGame[0].totalRound;
        // Update player2Name in the database
        await Game.findByIdAndUpdate(allDetails.databaseID, { player2Name : allDetails.player2Name });

        // Send JSON response indicating success
        res.status(200).json({ redirectTo: "/joinRoom/render/player-waiting-page" });
    } else {
        // Send JSON response indicating failure
        res.status(404).json({ error: "Room not found" });
    }
});

router.get("/render/player-waiting-page", (req, res) => {
    const playerName = [allDetails.player2Name, allDetails.player1Name];

    res.render("player-waiting-page", {
        RoomID: allDetails.roomID,
        playerName: playerName,
        loaderFlag: false,
        startButtonFlag: false,
    });
});


router.get("/game-start-check", async (req, res) => {
    try {
        const savedGame = await Game.findById(allDetails.databaseID);

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


module.exports = {router,allDetails};
