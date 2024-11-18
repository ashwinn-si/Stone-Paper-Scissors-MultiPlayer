//yourMove -> your move 
//computerMove -> o
function result_generator(your_move,opp_move){
    if(opp_move===your_move){
        return('tie');
    }else{
        if(your_move==='rock'){
            if(opp_move==='scissor'){
                return("win");
            }else{
                return("loss")
            }

        }else if(your_move==='paper'){
            if(opp_move==='rock'){
                return("win");
            }else{
                return("loss");
            }
        }else{
            if(opp_move==='paper'){
                return("win");
            }else{
                return("loss");
            }
        }
    }
}

module.exports = result_generator;