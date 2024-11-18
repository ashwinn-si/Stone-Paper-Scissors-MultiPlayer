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

router.post("/room-id-check",async(req,res)=>{
    roomID = parseInt(req.body.roomID, 10);
    const currGame = await Game.find({"roomID" : roomID})
    if(currGame.length == 1){
        databaseID = currGame[0]._id;
        player1Name = currGame[0].player1Name;
        await Game.findByIdAndUpdate(databaseID,{
            player2Name:player2Name
        }).then(()=>{
            res.status(200);
        })
    }else{
        res.sendStatus(404);
    }
})

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
        }
    })
})

module.exports = router;
