const express = require("express")

const router = express.Router();

const resultFinder = require("../public/scripts/resultFinder");

const resultTextFinder = require("../public/scripts/resultMessageFinder");

const Game = require("../models/game");

const {noneed_router:router1 , allDetails} = require("./joinRoomRoutes")

allDetails.player1Score=0;
allDetails.player2Score =0;
allDetails.currRound =1;
allDetails.player1Status="empty";
allDetails.player2Status="empty";

let winnerName = "";
let gameEndedFlag = false;

router.get("/render/player-move-page", async (req,res)=>{
    const currGame = await Game.findByIdAndUpdate(allDetails.databaseID,{
        player1Score:allDetails.player1Score,
        player2Score :allDetails.player2Score,
        currRound :allDetails.currRound,
    })
    res.render("move-selection-page",{
        player_1_name:allDetails.player1Name,
        player_2_name:allDetails.player2Name,
        player_1_score:allDetails.player1Score,
        player_2_score:allDetails.player2Score,
        curr_round:allDetails.currRound,
        player1Flag:false
    })
})

router.post("/player-move-sender",async (req,res)=>{
    await Game.findByIdAndUpdate(allDetails.databaseID,{
        player2Move:req.body.player2Move
    })
    let currGame = await Game.findById(allDetails.databaseID);
    allDetails.player2Move = currGame.player2Move;
    allDetails.player2Status = await resultFinder(currGame.player2Move,currGame.player1Move);
    let result_text = resultTextFinder(allDetails.player2Status,allDetails.player2Name,allDetails.player1Name);
    if (allDetails.player2Status === "win") {
        allDetails.player2Score++;
    }else if(allDetails.player2Status === "loss"){
        allDetails.player1Score++;
    }

    if(allDetails.player2Score == allDetails.totalRounds){
        winnerName = allDetails.player2Name;
        gameEndedFlag = true;
    }else if(allDetails.player1Score == allDetails.totalRounds){
        gameEndedFlag=true;
        winnerName = allDetails.player1Name;
    }
    res.render("player-move-display-page",{
        your_name:allDetails.player2Name,
        opp_name:allDetails.player1Name,
        your_score:allDetails.player2Score,
        opp_score:allDetails.player1Score,
        your_move : allDetails.player2Move,
        opp_move:allDetails.player1Move,
        winner_text:result_text,
        result_text:allDetails.player2Status,
        player1Flag:false,
        GameEndedFlag:gameEndedFlag,
    })
})

router.get("/render/player-move-display-page",(req,res)=>{
    let result_text = resultTextFinder(allDetails.player2Status,allDetails.player2Name,allDetails.player1Name);
    
    res.render("player-move-display-page",{
        your_name:allDetails.player2Name,
        opp_name:allDetails.player1Name,
        your_score:allDetails.player2Score,
        opp_score:allDetails.player1Score,
        your_move : allDetails.player2Move,
        opp_move:allDetails.player1Move,
        winner_text:result_text,
        result_text:allDetails.player2Status,
        player1Flag:false,
        GameEndedFlag:gameEndedFlag,
    })
})

router.get("/render/game-ended",async(req,res)=>{
    allDetails.player1Score=0;
    allDetails.player2Score =0;
    allDetails.currRound = 1;
    allDetails.player1Status="empty";
    allDetails.player2Status="empty";
    gameEndedFlag=false;
    await Game.findByIdAndUpdate(allDetails.databaseID,{
        roomID:0
    })
    res.render("game-ended-page",{
        winner:winnerName
    });
})

module.exports = router;