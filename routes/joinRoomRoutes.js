const express = require("express");

const router = express.Router();

const Game = require("../models/game");

let player2Name = "";
let player1Name = "";
let databaseID = "";
let gameID = "";
let allDetails=[];

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
    res.render("room-id-enter-page",{"ErrorFlag":false})
})

const mongoose = require("mongoose");

router.post("/room-id-check", async (req, res) => {
    const roomID = req.body.roomID;
    const player2Name = req.body.player2Name; // Assuming player2Name is being sent in the request

    try {
        // Fetch the current game by roomID
        const currGame = await Game.findOne({ roomID: roomID });

        // Check if a game exists with the given roomID
        if (currGame) {
            const databaseID = currGame._id;

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(databaseID)) {
                return res.status(400).send("Invalid Database ID");
            }

            const player1Name = currGame.player1Name;

            // Update player2Name in the game
            await Game.findByIdAndUpdate(databaseID, {
                player2Name: player2Name,
            });

            // Prepare player names for rendering
            const playerName = [player2Name, player1Name];

            // Render the player-waiting-page
            return res.render("player-waiting-page", {
                RoomID: roomID,
                playerName: playerName,
                loaderFlag: false,
                startButtonFlag: false,
            });
        } else {
            // No game found with the given roomID
            return res.status(404).send("Room not found");
        }
    } catch (error) {
        console.error("Error in /room-id-check:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/render/player-waiting-page",(req,res)=>{
    const playerName = [player2Name,player1Name];
    res.render("player-waiting-page",{ 
        "RoomID" : roomID,
        "playerName" : playerName,
        "loaderFlag" : false,
        "startButtonFlag":false
    });
})

router.get("/game-start-check",async (req,res)=>{
    await Game.findById(databaseID).then((savedGame)=>{
        let gameStatus = savedGame.gameStart;
        if(gameStatus==="no"){
            res.sendStatus(404);
        }else{
            res.sendStatus(200);
            res.render("move-selection-page",{
                player_1_name:allDetails.player1Name,
                player_2_name:allDetails.player2Name,
                player_1_score:allDetails.player1Score,
                player_2_score:allDetails.player2Score,
                curr_round:allDetails.currRound,
                player1Flag:false
            })
        }
    })
})

module.exports = router;
