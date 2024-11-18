function resultTextFinder(text,player1Name,player2Name){
    let result_text="";
    if(text ==="win"){
        result_text=player1Name;
    }else if(text==="loss"){
        result_text=player2Name;
    }else{
        result_text="tie";
    }
    return result_text;
}

module.exports = resultTextFinder;