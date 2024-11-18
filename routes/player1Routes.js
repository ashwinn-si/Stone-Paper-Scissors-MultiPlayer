const express = require("express")

const router = express.Router();

const Game = require("../models/game");

const resultFinder = require("../public/scripts/resultFinder");

const resultTextFinder = require("../public/scripts/resultMessageFinder");

const {noneed_router:router1 , allDetails} = require("./createRoomRoutes")

let winnerName = "";
let gameEndedFlag = false;

allDetails.player1Score=0;
allDetails.player2Score =0;
allDetails.currRound = 1;
allDetails.player1Status="empty";
allDetails.player2Status="empty";


router.post("/player-move-page",async(req,res)=>{
    await Game.findByIdAndUpdate(allDetails.databaseID,{
        gameStart:"yes"
    })
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
        player1Flag:true
    })
})

router.get("/render/player-move-page",(req,res)=>{
    res.render("move-selection-page",{
        player_1_name:allDetails.player1Name,
        player_2_name:allDetails.player2Name,
        player_1_score:allDetails.player1Score,
        player_2_score:allDetails.player2Score,
        curr_round:allDetails.currRound,
        player1Flag:true  
    })
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post("/player-move-sender", async (req, res) => {
    // Update player1's move in the database
    let currGame = await Game.findByIdAndUpdate(allDetails.databaseID, {
        player1Move: req.body.player1Move,
    });
    allDetails.player1Move = req.body.player1Move;
    // Wait for 1 m-second before processing

    await delay(500);

    // Fetch the updated game details
    currGame = await Game.findById(allDetails.databaseID);

    if (!currGame) {
        return res.status(404).send("Game not found");
    }

    allDetails.player2Move = currGame.player2Move;
    allDetails.player1Score = currGame.player1Score;
    allDetails.player2Score = currGame.player2Score;
    while(allDetails.player2Move === "empty"){
        currGame = await Game.findById(allDetails.databaseID);
        allDetails.player2Name = currGame.player2Move;
    }

    // Determine the result for player1
    allDetails.player1Status = await resultFinder(currGame.player1Move, currGame.player2Move);

    // Update scores based on the result
    if (allDetails.player1Status === "win") {
        allDetails.player1Score++;
    }else if(allDetails.player1Status === "loss"){
        allDetails.player2Score++;
    }
    // Increment the current round
    allDetails.currRound++;

    // Generate the result text
    const result_text = resultTextFinder(allDetails.player1Status, allDetails.player1Name, allDetails.player2Name);


    if(allDetails.player2Score == allDetails.totalRounds){
        winnerName = allDetails.player2Name;
        gameEndedFlag = true;
    }else if(allDetails.player1Score == allDetails.totalRounds){
        gameEndedFlag=true;
        winnerName = allDetails.player1Name;
    }

    // Render the updated page
    res.render("player-move-display-page", {
        your_name: allDetails.player1Name,
        opp_name: allDetails.player2Name,
        your_score: allDetails.player1Score,
        opp_score: allDetails.player2Score,
        your_move: allDetails.player1Move,
        opp_move: allDetails.player2Move,
        result_text:allDetails.player1Status,
        winner_text: result_text,
        player1Flag: true,
        GameEndedFlag:gameEndedFlag,
    });
});


router.get("/render/player-move-display-page",(req,res)=>{
    let result_text = resultTextFinder(allDetails.player1Status,allDetails.player1Name,allDetails.player2Name);

    res.render("player-move-display-page",{
        your_name:allDetails.player1Name,
        opp_name:allDetails.player2Name,
        your_score:allDetails.player1Score,
        opp_score:allDetails.player2Score,
        your_move : allDetails.player1Move,
        opp_move:allDetails.player2Move,
        winner_text:result_text,
        result_text:allDetails.player1Status,
        player1Flag:true,
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