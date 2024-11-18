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
    roomID = req.body.roomID;
    const currGame = await Game.find({"roomID" : roomID})
    if(currGame.length == 1){
        databaseID = currGame[0]._id;
        player1Name = currGame[0].player1Name;
        await Game.findByIdAndUpdate(databaseID,{
            player2Name:player2Name
        }).then(()=>{
            res.sendStatus(400);
            const playerName = [player2Name,player1Name];
            res.render("player-waiting-page",{ 
                "RoomID" : roomID,
                "playerName" : playerName,
                "loaderFlag" : false,
                "startButtonFlag":false
            });
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
