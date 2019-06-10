
var twoD = [];
var text = [];
var w = 0;
var h = 0;
var divHeight = document.getElementById("velvetFrame").clientHeight;
var divWidth = document.getElementById("velvetFrame").clientWidth;

var mobile = isMobileDevice();
if (mobile) {
    w = Math.floor(divWidth / 27);
    h = Math.floor(divHeight / 45);
} else {
    w = Math.floor(divWidth / 25);
    h = Math.floor(divHeight / 45);

}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

var quit = false;
var hits = 0;
var fill = 0;
var cycle = 1;
var cycleBack = 1;
var revealDone = false;
var coverDone = false;
var contentArray = [];
var pause;
window.addEventListener("keypress", qKeyListener);
main();


async function main() {

    var getContent = await importContent("velvetText.txt");
    //document.getElementById("main").textContent += "imported content";
    var created = await createArrays();
    //document.getElementById("main").textContent += "created arrays";


    var content = await fillContent();
    //document.getElementById("main").textContent += "filled content";
    var correct = await reveal();



    var intervalTimer = setInterval(async function () {
        if (revealDone == false) {
            var count = await reveal();
            cycle = cycle + 1;


        } else if (fill < w * h) {
            var count = await cover();
            cycleBack = cycleBack + 1;
        }
        else {
            clearInterval(intervalTimer);

        }
    }, 100);


    var loopTimer = setInterval(function () {
        loop();
    }, 15000);

}

async function loop() {

    document.getElementById("main").textContent = "";
    quit = false;
    hits = 0;
    fill = 0;
    cycle = 1;
    cycleBack = 1;
    revealDone = false;
    coverDone = false;
    created = await createArrays();
    content = await fillContent();
    correct = await reveal();



    intervalTimer = setInterval(async function () {
        if (revealDone == false) {
            count = await reveal();
            cycle = cycle + 1;


        } else if (fill < w * h) {
            count = await cover();
            cycleBack = cycleBack + 1;
        }
        else {
            clearInterval(intervalTimer);

        }
    }, 100);
}


async function importContent(path) {
    return new Promise(resolve => {
        var textFile = new XMLHttpRequest();
        textFile.open("GET", path);

        textFile.onreadystatechange = function () {

            if (textFile.readyState == 4) {
                if (textFile.status == 200) {
                    var data = textFile.responseText;
                    //document.getElementById("main").textContent += "responseText dealt with";

                    contentArray = data.split("\n");
                    resolve();
                } else {
                    document.getElementById("main").textContent += "rejected XML request with status " + textFile.status;
                }
            }

        };

        textFile.send();
    });

}



async function createArrays() {
    return new Promise(resolve => {

        for (let i = 0; i < h; i++) {
            twoD[i] = [];
            for (j = 0; j < w; j++) {
                twoD[i][j] = '&';
            }
        }




        for (let k = 0; k < h; k++) {
            text[k] = [];
            for (l = 0; l < w; l++) {
                text[k][l] = ' ';
            }
        }


        resolve();
    })//end of promise
}//end of createArrays


async function fillContent() {
    return new Promise(resolve => {

        // Pick random string from contentArray and assign to variable
        var element = Math.floor(Math.random() * contentArray.length);
        var string = contentArray[element];


        var chars = string.split("");
        var charsToAdd;


        //compare width of the array to the length of the selected string
        padding = (text[1].length - string.length);


        if(padding < 0){
            //The string is longer than the width of the array

                chars = [];      //content to put in the first line
                var chars2 = []; //content to put in the second line
                var chars3 = []; //content to put in the third line
                var line1Finished = false;
                var line2Finished = false;
                //split string into array containing the individual words
                var words = string.split(" ");

                for(var i = 0; i < words.length; i++){
                    // check if one more word can be added to the first line with enough space on the edges to look nice (the -5)
                        if((chars.length + words[i].length) < (text[1].length - 5) && line1Finished == false){
                            charsToAdd = words[i].split("");
                            charsToAdd.push(" ");
                                for(k = 0; k < charsToAdd.length; k++){
                                    chars.push(charsToAdd[k]);
                        }
                            //else, check if the word can be added to the second line with enough space to spare
                        }else if((chars2.length + words[i].length) < (text[1].length - 5) && line2Finished == false) {
                            line1Finished = true;
                   	        charsToAdd = words[i].split("");
                            charsToAdd.push(" ");
                                for(k = 0; k < charsToAdd.length; k++){
                                    chars2.push(charsToAdd[k]);
                                }
                        }else{
                            line2Finished = true;
                            charsToAdd = words[i].split("");
                            charsToAdd.push(" ");
                                for(k = 0; k < charsToAdd.length; k++){
                                    chars3.push(charsToAdd[k]);    

                                }
                    //center all lines in their respective rows
                    var buffer = text[1].length - chars.length;
                    var buffer2 = text[1].length - chars2.length;
                    var buffer3 = text[1].length - chars3.length;
                            
                        for (j = 0; j < buffer / 2; j++) {
                            chars.push(" ");
                        }

                        for (j = 0; j < buffer / 2; j++) {
                            chars.unshift(" ");
                        }

                        for (j = 0; j < buffer2 / 2; j++) {
                            chars2.push(" ");
                        }
    
                        for (j = 0; j < buffer2 / 2; j++) {
                            chars2.unshift(" ");
                        }
                            
                            
                        if(chars3.length != 0){
                             for (j = 0; j < buffer3 / 2; j++) {
                                chars3.push(" ");
                            }
    
                            for (j = 0; j < buffer3 / 2; j++) {
                                chars3.unshift(" ");
                            }
                            
                        }
                        
       


                //Place lines into correct rows in array
                    var middle = Math.floor(text.length / 2);
                    text[middle] = chars;
                    text[middle + 1] = chars2;
                    
                    if(chars3.length  1){
                        text[middle + 2] = chars3;
                    }
        } // end of multiple-line if


        if(padding >= 0){
            //The selected string fits on one line of the array
                for (j = 0; j < padding / 2; j++) {
                    chars.push(" ");
                }

                for (j = 0; j < padding / 2; j++) {
                    chars.unshift(" ");
                }


            text[Math.floor(text.length / 2)] = chars;
        }
        resolve();
    });
}


//randomly pick element of 2d array and replace with correct letter
function reveal() {
    return new Promise(resolve => {
        for (i = 0; i < 9 * cycle; i++) {

            var row = Math.floor((Math.random() * twoD.length));
            var column = Math.floor((Math.random() * twoD[row].length));

            if (twoD[row][column] == '&') {


                var letter = text[row][column];

                twoD[row][column] = letter;
                document.getElementById("main").textContent = "";

                for (l = 0; l < twoD.length; l++) {
                    document.getElementById("main").textContent += twoD[l].join("");
                    document.getElementById("main").innerHTML += "\n";
                }
                //document.getElementById("main").textContent += "divWidth: " + divWidth + " divHeight: " + divHeight;
                //document.getElementById("main").textContent += "twoD height: " + twoD.length + " text height " + text.length;

                hits = (hits + 1);
                if (hits >= w * h) {
                    revealDone = true;
                }

                if (i == (9 * cycle) - 1) {
                    resolve();
                }
            }//end of if
        }//end of for

    })
}//end of reveal


//randomly select element of twoD and change it back to symbol
function cover() {
    return new Promise(async resolve => {
        if (cycleBack == 1) {
            let holdUp = await pause();
        }
        for (let i = 0; i < 8 * cycleBack; i++) {
            var row = Math.floor((Math.random() * twoD.length));
            var column = Math.floor((Math.random() * twoD[row].length));

            if (twoD[row][column] != '&') {

                fill = fill + 1;
                twoD[row][column] = '&';
                document.getElementById("main").textContent = "";

                for (let l = 0; l < twoD.length; l++) {
                    document.getElementById("main").textContent += twoD[l].join("");
                    document.getElementById("main").innerHTML += "\n";
                }
                if (fill >= w * h) {
                    coverDone = true;
                    resolve();
                }
                if (i == (8 * cycleBack) - 1) {
                    resolve();
                }
            }

        }//end of for loop


    })
}//end of cover function


//Pause execution for three seconds
async function pause() {
    return new Promise(resolve => {
        setTimeout(function () {
            resolve();
        }, 3000);

    })
}


//Listen for 'q' key. If I ever get the quit option working.
function qKeyListener(event) {
    //var userInput = "";

    if (event.keyCode != 81) { // 81 is the numerical key code for "q"
        if(event.keyCode == 97){ //keycode for 'a'
            var newEntry = await addEntry("testString");
        }
    }
    else {    // The user has hit q
        quit = true;
    }

}


        
async function addEntry(newString){
        return new Promise(resolve => {
            
            var xhttp = new XMLHttpRequest();
            
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                     var sendURL = "www.ennui.online/vvadstring=" + newString;
                     xhttp.open("POST", sendURL);
                     xhttp.send();
                    resolve();
                 }
            };
            

            
            
        })


}
