const testWord = WORDS[Math.floor(Math.random()*WORDS.length)];
let inputWord = [];
let turnCounter = 0;
let WORDLENGTH = 5;
const colors = {
    wrong: '#343844',
    halfRight: '#8c86aa',
    right: '#067bc2',
};
let letterCounter = 0;
let gameOver = 0;

const stepTime = 200;
const flipTime = 600;

const qwerty = "qwertyuiopasdfghjklzxcvbnm"
const qwertyArr = qwerty.toUpperCase().split("");


$(() => {
    
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
            shakeRow(turnCounter);
        }
    } else {
        log("Not enough letters!");
        shakeRow(turnCounter);
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

        flipSquare($(`#letter${i}`),colors.wrong,i); //*grey
        markKeyboard(inputWord[i], colors.wrong);
        
        if(inputWord[i] === testWordDouble[i]){ //if letter is in correct square
            flipSquare($(`#letter${i}`),colors.right, i); //*correct
            markKeyboard(inputWord[i], colors.right);
            correctLetter++;
            inputWord[i] = "";
            testWordDouble[i] = ""; //replace the common letter with a blank
        }
    }

    for (let i = 0 ; i < WORDLENGTH ; i++){
        for (let j = 0; j < WORDLENGTH ; j++){
            if((inputWord[i] === testWordDouble[j]) && (inputWord[i] != "")){ //if letter exists but not in correct square
                flipSquare($(`#letter${i}`),colors.halfRight, i); //*half-correct
                markKeyboard(inputWord[i], colors.halfRight);
                testWordDouble[j] = ""; //replace the common letter with a blank
                j = 4; //force end loop
            }
        } 
    }
    
    inputWord = [];
    console.log(testWordDouble, turn);
    if(correctLetter === WORDLENGTH){
        win();
    } else {
        for(let i = 0 ; i < 5 ; i++){
            $(`#letter${i}`).attr('id', 'locked'); 
        }
    }
}

function flipSquare ($div, color, num){
    setTimeout(()=>{
        gameOver = 1; // disallow input while animation plays
        $div.css({animation: `flip ${flipTime}ms ease-out`});
    }, stepTime*(num));
    setTimeout(()=>{
        $div.css('background', color);
        $div.css('border-color', color);
    }, (stepTime*(num)+(flipTime/2)));
    setTimeout(()=>{
        gameOver = 0; // allow input after animation plays
        keyDown = false;
    }, (stepTime*4 +(flipTime)));
}

const correctLetters=[];

function markKeyboard (letter, color) {

    setTimeout(()=>{
        $(`#button-${letter}`).css('background', color);
        for(let i = 0; i <= correctLetters.length ; i++){
            if(letter === correctLetters[i]){
                $(`#button-${letter}`).css('background', colors.right); //prevent correct letter from being overwritten
            }
        }
        if(color === colors.right){
            correctLetters.push(letter);
            //console.log(correctLetters);
        }
    }, (stepTime) + (stepTime*4 +(flipTime)));
}

function win(){
    const stepTime = 100;
    gameOver = 1;
    gameOverLog('Yay! You guessed the word!');
    for (let i = 0 ; i < 5 ; i++){
        setTimeout(()=>{
            gameOver = 1;
            $(`#letter${i}`).css({animation: `rise 1s ease-out`});
        }, (stepTime*(i+3)) + (stepTime*4 +(flipTime)));
    }
}

function lose (){
    gameOver = 1;
    gameOverLog('Try again next time!');
}

function gameOverLog(str){
    setTimeout(()=>{
        $('#gameover-log').text(str);
    }, (stepTime) + (stepTime*4 +(flipTime)));
}

function log(msg){
    const $divLog = $('<div>').text(msg).attr('id', 'message-log');
    $('#message-container').append($divLog);
    $divLog.fadeOut(1000);
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

function shakeRow(num){
    //$(`#row${num}`).finish();
    $(`#row${num}`).css({animation: `wiggle 0.5s ease-out`});
    setTimeout(()=>{
        $(`#row${num}`).css({animation: ''});
    }, 500)
}

let keyDown = false;

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
        } else if (keyCode === 13){ //Enter
            if(!keyDown){
                keyDown = true;
                submitWord();
            }
        } 
    }
});
    
$(window).keyup(function(e) { //*prevent continuous input when Enter key is held down
    if(gameOver === 0){
        let keyCode = e.keyCode;
    
        if (keyCode === 13){ //Enter)
            keyDown = false;
        } 
    }
});

for (let i = 0 ; i < 3 ; i++){
    for (let j = 0 ; j < qwertyArr.length ; j++){
        const $divLetter = $('<div>').attr('id',`button-${qwertyArr[j]}`).addClass('button').text(qwertyArr[j]);
        $(`#button-row${i}`).append($divLetter);
        if((qwertyArr[j] === 'P' && i === 0) || (qwertyArr[j] === 'L' && i === 1)){
            i++;
        }
    }
}

const $divEnter = $('<div>').attr('id',`button-enter`).addClass('button custom').text('ENTER');
const $divBackspace = $('<div>').attr('id',`button-backspace`).addClass('button custom').text('<[X]');

$('#button-Z').before($divEnter);
$('#button-M').after($divBackspace);

$('.button').on("click", (event)=>{
    if(gameOver === 0){
        // console.log(event.target.id)
        for(let i = 0 ; i < qwertyArr.length ; i++){
            if(event.target.id === `button-${qwertyArr[i]}`){ //A-Z
                if(letterCounter < WORDLENGTH){
                    inputLetter(qwertyArr[i],letterCounter);
                    letterCounter++;
                }
            } 
        }
        if (event.target.id === `button-backspace`) { //Backspace
            if(letterCounter >= 0){
                removeLetter(letterCounter-1);
                if(letterCounter !== 0){
                    letterCounter--
                }
            }
        } else if (event.target.id === `button-enter`) { //Enter
            submitWord();
        }
    }
});


});














