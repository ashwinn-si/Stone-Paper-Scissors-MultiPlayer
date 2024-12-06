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

router.get("/render/player-name-page", (req, res) => {
    const buttonContent = {
        content: "Create",
        location: "/createRoom/player-waiting-page"
    };
    res.render("player-name-page", { "buttonContent":buttonContent });
});

router.post("/player-waiting-page", async(req,res)=>{
    const currGame = new Game({
        player1Name : req.body.player1Name,
        roomID : req.body.roomID,
        player1Move : "empty",
        player2Move : "empty",
        totalRound : parseInt(req.body.noRounds, 10),
        gameStart:"no",
    })
    await currGame.save().then(savedGame =>{
        allDetails.databaseID = savedGame._id;
        allDetails.roomID = savedGame.roomID;
        allDetails.player1Name = savedGame.player1Name;
        allDetails.totalRounds = savedGame.totalRound;
    }).then(()=>{
        res.render("player-waiting-page");
    })
})

router.get("/render/player-waiting-page",async (req,res)=>{
    
    const currGame = await Game.findById(allDetails.databaseID).then((savedGame)=>{
        const playerName = [allDetails.player1Name];
        allDetails.roomID = savedGame.roomID;
        res.render("player-waiting-page",{ 
            "RoomID" : savedGame.roomID,
            "playerName" : playerName,
            "loaderFlag" : true,
            "startButtonFlag":true
        });
    })
})






module.exports = {router,allDetails};