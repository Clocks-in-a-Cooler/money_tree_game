/*
    the idea: grow a money tree
    the player starts with only a seed.
    they can water, add fertilizer, and harvest from the tree
    they're trying not to kill it.

    i'm going to draw on my gardening experience for this...
*/

var canvas, context;
var money_counter;

var buy_screen;
function init() {
    initialize_store();   
    canvas  = document.querySelector("canvas");
    context = canvas.getContext('2d');
}

function update_money_counters() {
    var counters = document.getElementsByClassName("money_counter");
    for (var c = 0; c < counters.length; c++) {
        counters[c].innerHTML = "money: $" + Game.money;
    }
}

var Game = {
    money: 0,
};

//animation stuff -------------------------------------------

var last_time = null, lapse = 0, paused = false;

function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    last_time = time;

    if (!paused) {
        cycle(lapse);
    }
}

function cycle(lapse) {
    //finish
}