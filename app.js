$(() => {
    
const testWord = WORDS[Math.floor(Math.random()*WORDS.length)];
let inputWord = [];
let turnCounter = 0;
let WORDLENGTH = 5;
// let hasInput = false;
    
// function printWord (string) {
//     inputWord = [];

//     for(letter of string){
//         inputWord.push(letter.toUpperCase());
//     }
    
//     for (let i = 0 ; i < 5 ; i++){
//         $(`#letter${i}`).text(inputWord[i])
//     }

// }

// $("form").on("submit", (event) => {

//     event.preventDefault();
//     const string = $("#input-box").val();
    
//     if(checkDictionary(string)){
//         printWord(string);
//         hasInput = true;
//     } else {
//         console.log("Invalid word!");
//     }

//     $(event.currentTarget).trigger("reset");

// });

// $('#check').on("click", ()=>{
//     // if(hasInput){
//         compareWord(turnCounter);
//         toggleNextRow(turnCounter);
//         turnCounter++
//         if(turnCounter > 6){
//             lose();
//         }
//         letterCounter = 0;
//     // }
// })

function inputLetter (letter, num) {
    inputWord.push(letter.toUpperCase());
    $(`#letter${num}`).text(inputWord[num]);
    //console.log(inputWord);
}

function removeLetter (num) {
    inputWord.pop();
    $(`#letter${num}`).empty();
}

function submitWord(){
    if(letterCounter === WORDLENGTH){ //check length

        if(checkDictionary(inputWord)){ //check validity of word
            compareWord(turnCounter); // compare with answer word
            //if not correct:
            turnCounter++;
            if((turnCounter > 5) && (gameOver === 0)){
                lose();
            }
            toggleNextRow(turnCounter); //move to next row 
            letterCounter = 0;

        } else {
            log("Invalid word!");
            emptyRow(turnCounter);
        }
    } else {
        log("Not enough letters!");
        emptyRow(turnCounter);
    }
}

function checkDictionary(wordArr){
    let word = "";
    
    for(element of wordArr){
        word += element.toLowerCase(); //convert array of letters to a string (all lower case)
    }

    for(let i = 0 ; i < WORDS.length ; i++){
        if(word === WORDS[i]){
            return true;
        }
    }
    return false;
}

function compareWord (turn) {
    let correctLetter = 0;
    const testWordDouble = [];
    
    for(letter of testWord){
        testWordDouble.push(letter.toUpperCase());
    }
    
    for (let i = 0 ; i < WORDLENGTH ; i++){
        
        $(`#letter${i}`).css('background', '#454545'); //grey

        if(inputWord[i] === testWordDouble[i]){ //if letter is in correct square
            $(`#letter${i}`).css('background', '#5688c7'); //green
            correctLetter++;
            inputWord[i] = "";
            testWordDouble[i] = ""; //replace the common letter with a blank
        }
    }

    for (let i = 0 ; i < WORDLENGTH ; i++){
        for (let j = 0; j < WORDLENGTH ; j++){
            if((inputWord[i] === testWordDouble[j]) && (inputWord[i] != "")){ //if letter exists but not in correct square
                $(`#letter${i}`).css('background', '#8d6a9f'); //yellow
                testWordDouble[j] = ""; //replace the common letter with a blank
                j = 4; //force end loop
            }
        }
        
        $(`#letter${i}`).attr('id', 'locked');        
    }
    
    inputWord = [];
    console.log(testWordDouble, turn);
    if(correctLetter === WORDLENGTH){
        win();
    }
}

function win(){
    $('form').hide();
    log('You guessed the word!');
    gameOver = 1;
}

function lose (){
    $('form').hide();
    log('Try again next time!');
    gameOver = 1;
}

function log(msg){
    const $divLog = $('<div>').text(msg).attr('id', 'message-log');
    $('#message-container').append($divLog);
    //$divLog.hide(2000);
}

function toggleNextRow (turn) {
    $(`#row${turn}`).empty();
    if(turn < 6){
        for(let i = 0 ; i < WORDLENGTH ; i++){
            const $square = $('<div>').addClass("letter-square letter").attr('id', `letter${i}`);
            $(`#row${turn}`).append($square);
        }
    }
}

function emptyRow(num){
    $(`#row${num}`).effect("shake", {distance:5});
}


let letterCounter = 0;
let gameOver = 0;

$(window).keydown(function(e) {
    if(gameOver === 0){
        let key = e.key;
        let keyCode = e.keyCode;
    
        if (keyCode >= 65 && keyCode <= 90){ //a-z / A-Z
            //console.log(key);
            if(letterCounter < WORDLENGTH){
                inputLetter(key,letterCounter);
                letterCounter++;
            }
        } else if (keyCode === 8){ //Backspace
            if(letterCounter >= 0){
                removeLetter(letterCounter-1);
                if(letterCounter !== 0){
                    letterCounter--
                }
            }
        } else if (keyCode === 13){ //Enter)
            submitWord();
        } 
    }

});

















});