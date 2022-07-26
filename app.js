$(() => {
    
const testWord = 'apple'//WORDS[Math.floor(Math.random()*WORDS.length)];
let inputWord = [];
let turnCounter = 1;
let hasInput = false;
    
function printWord (string) {
    inputWord = [];

    for(letter of string){
        inputWord.push(letter.toUpperCase());
    }
    
    for (let i = 0 ; i < 5 ; i++){
        $(`#letter${i}`).text(inputWord[i])
    }

}

function checkDictionary(word){
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
    
    for (let i = 0 ; i < 5 ; i++){
        
        $(`#letter${i}`).css('background', '#454545'); //grey
        
        for (let j = 0; j < 5 ; j++){
            if(inputWord[i] === testWordDouble[j]){ //if letter exists but not in correct square
                $(`#letter${i}`).css('background', '#b59f3b'); //yellow

                if(i===j){ //if letter is in correct square
                    $(`#letter${i}`).css('background', '#538d4e'); //green
                    correctLetter++;
                }
                
                testWordDouble[j] = ""; //replace the common letter with a blank
                j = 4; //force end loop
            }
        }
        
        $(`#letter${i}`).attr('id', 'locked');        
    }
    
    inputWord = [];
    hasInput = false;
    console.log(testWordDouble, turn);
    if(correctLetter === 5){
        win();
    }
}

function win(){
    $('form').hide();
    $('#message-log').text('You guessed the word!');
}

function lose (){
    $('form').hide();
    $('#message-log').text('Try again next time!');
}

function toggleRow (turn) {
    $(`#row${turn}`).empty();
    if(turn < 6){
        for(let i = 0 ; i < 5 ; i++){
            const $square = $('<div>').addClass("letter-square letter").attr('id', `letter${i}`);
            $(`#row${turn}`).append($square);
        }
    }
}

$("form").on("submit", (event) => {

    event.preventDefault();
    const string = $("#input-box").val();
    
    if(checkDictionary(string)){
        printWord(string);
        hasInput = true;
    } else {
        console.log("Invalid word!");
    }

    $(event.currentTarget).trigger("reset");

});

$('#check').on("click", ()=>{
    if(hasInput){
        compareWord(turnCounter);
        toggleRow(turnCounter);
        turnCounter++
        if(turnCounter > 6){
            lose();
        }
    }
})

















});