/* Fallout Hacking Game
   for Node.js
   Made for the purpose of trying to learn the JavaScript syntax really.

   This really isn't what Node is for.

   Zachary Shannon - December 2015*/

// Fallout idea from: https://www.reddit.com/r/dailyprogrammer/comments/3qjnil/20151028_challenge_238_intermediate_fallout/

/**
* Returns how many letters between two argument strings are both
* the same AND in the same position.
*/
function compareWords(guess, word){
    var nSameChars = 0;

    for(i = 0; i < guess.length; i++){
        if(guess.charAt(i) == word.charAt(i)){
            nSameChars++;
        }
    }

    return nSameChars;
}

/**
* A game object.
*/
var Game = function(password){
    //A game is not started by default.
    this.started = false;
    this.password = password;

    this.guesses = 5; //Hard coded, for now

    this.canGuess = function(){
        if(this.guesses == 0){
            return false;
        }
        else{
            return true;
        }
    }

    //Returns number of correct characters, if we can guess.
    this.guess = function(word){
        if(this.started == true){
            this.guesses--; //Used one guess.

            if(this.guesses > 0){
                return compareWords(word, this.password);
            }
        }

    }
}

//Create a game.
var theGame;

//Read dictionary to file ASYNCHRONOUSLY
var fs = require('fs');
var dictionary = new Array();

//We can't really do anything until this is done. Could be a problem!
fs.readFile('enable1.txt', 'utf8', function(err, data){
    if (err){
        //Handle errors.
        return console.log(err);
    }
    else{
        //Create dictionary to use.
        dictionary = data.toString().split("\n");
        console.log("Loaded dictionary with " + dictionary.length + " words.");
    }
});


//Create something to handle user input.
var util = require('util');
var stdin = process.openStdin();

//Acting on input
//http://stackoverflow.com/questions/23044429/block-for-stdin-in-node-js

//Array of handlers for actions.
var actionHandler = new Array();

/**
* Run any game commands.
*/
actionHandler['game'] = function(cmds){
  if(gameActionHandler[cmds[1]]){
      gameActionHandler[cmds[1]](cmds);
  }
  else{
      console.log("Argument not recognised '" + gameCommandHandler[0] + "'.");
  }
}

/**
* Lets the user make guesses.
*/
actionHandler['guess'] = function(cmds){
    if(typeof cmds[1] != 'undefined'){
        var guessResult = theGame.guess(cmds[1]);

        //Winning
        if(typeof guessResult == 'undefined'){
            console.log("No more guesses....");
        }
        else if(guessResult == 7){ ///Ehhh really?
            console.log("You win!");
        }
        else{
            console.log(guessResult + " characters matched.");
        }
    }
    else{
        console.log("You didn't guess anything!");
    }
}

//Handles actions related to the game.
var gameActionHandler = new Array();

gameActionHandler ['prtdictionary'] = function(cmds){
    arrPrint(dictionary);
}
gameActionHandler['start'] = function(cmds){

    var len = 7;

    theGame = new Game();

    console.log("Hello! This terminal has word length " + len + ".");
    console.log("---- WORDS ----");

    theGame.started = true;

    //Get a dictionary of words to use for this game.
    var lenWords = wordsOfLength(len);

    //Make a list of words
    var gameWords = new Array();
    for(i = 0; i < 12; i++){
        gameWords.push(pickWord(lenWords));
    }

    //Get the password
    theGame.password = pickWord(gameWords);
    //Print the words for the game.
    arrPrint(gameWords);

}

/**
* Function to handle user input and return an error if it is incorrect.
*/
function inputHandler(cmds){
    if(actionHandler[cmds[0]]){
        actionHandler[cmds[0]](cmds);
    }
    else{
        console.log("Command not recognised '" + cmds[0] + "'.");
    }
}

/**
* Listener to get input.
*/
stdin.addListener("data", function(data) {
    //Thanks to : http://stackoverflow.com/questions/8128578/reading-value-from-console-interactively

    //Remove line feed. Ignore case. Split to array.
    var cmds = data.toString().trim().toLowerCase().split(" ");
    inputHandler(cmds);
});


/**
* Prints out argument array.
*/
function arrPrint(arr){
    for(i = 0; i < arr.length; i++){
        console.log(arr[i]);
    }
}

/**
* Gets a list of words of length len from the dictionary.
*/
function wordsOfLength(len){
    var lenWords = new Array();

    for(i = 0; i < dictionary.length; i++){
        if(dictionary[i].length == len + 1){ //I don't know why this needs to be + 1
            lenWords.push(dictionary[i]);
        }
    }
    return lenWords;
}

/**
* Picks a random word from array.
*/
function pickWord(arr){
    return arr[Math.floor(random(0, arr.length))];
}

/**
* Gets a random number within range.
*/
function random(min, max){
    return Math.random() * (max - min) + min;
}
