
var LANG = {};

LANG.tens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

var GAME_DATA = {};

GAME_DATA.bank = 0;
GAME_DATA.rateOfTime = 1.0;
GAME_DATA.numberOfClocks = 0;

GAME_DATA.consoleQueue = [];

function SetupGame() {
    GAME_DATA.root_el = $('#game');
    
    GAME_DATA.root_el.empty();
    
    GAME_DATA.bar_el = $('<div id="game_bar">Time: None</div>').appendTo(GAME_DATA.root_el);

    GAME_DATA.console_el =$('<div id="game_console"></div>').appendTo(GAME_DATA.root_el);
    
    GAME_DATA.menu_el = $('<div id="game_menu"></div>').appendTo(GAME_DATA.root_el);

    GAME_DATA.window_el = $('<div id="game_window">Stuff!</div>').appendTo(GAME_DATA.root_el);

    //TODO: load stuff here

    UpdateBar();
    StartGame();
}

function StartGame() {
    /* TODO: By the time this is called from SetupGame() I should have loaded any saved game data */
    
    
    GAME_DATA.consoleQueue.push('<strong>* You hear a door creak open behind you. *</strong><br><br><i>(Revealing a sharply dressed man in a suit.)</i>');
    GAME_DATA.consoleQueue.push('<strong>[SUIT]</strong> Oh! Hello. I didn\'t see you there.');
    GAME_DATA.consoleQueue.push('<i>(He was the one who opened the door...)</i>');
    GAME_DATA.consoleQueue.push('<strong>[SUIT]</strong> Well, since you\'re already sitting down...');
    GAME_DATA.consoleQueue.push('<strong>[SUIT]</strong> As you know, here at Microsecond International we\'ve found a way to convert wasted time directly into STUFF.');
    GAME_DATA.consoleQueue.push('<strong>[SUIT]</strong> That\'s right! Stuff! Real, actual things.<br><br><i>(Who asked you?)</i>');
    GAME_DATA.consoleQueue.push('<strong>[SUIT]</strong> Yuuup! It\'s basically the American Dream on crack.');
    GAME_DATA.consoleQueue.push('<strong>[SUIT]</strong> Anyway, Time\'s not going to waste itself. Get slacking!');
    GAME_DATA.consoleQueue.push('<strong>* The door slams shut behind you. *</strong>')
    //this way the game starts fast and then figures out the interval from there.
    GAME_DATA.lastTickInterval = 0;
    GAME_DATA.tickID = window.setInterval(GameTick, 2000);
}

function CalculateTickInterval() {
    return 10000 * (1 / GAME_DATA.rateOfTime); 
}

function CalculateProfitPerTick() {
    return 1;
}


function GameTick() {
    console.log("tick");
    //update game state
    GAME_DATA.bank += CalculateProfitPerTick();
    
    //update UI state
    UpdateBar();
    
    //Say the first thing in the queue
    if (GAME_DATA.consoleQueue.length) {
        var text = GAME_DATA.consoleQueue.shift();
        SayHTML(text)
    }
    
    //if nothing is in the console, say SOMETHTHING
    if (GAME_DATA.console_el.children().length == 0) {
        SayHTML('<i>(Time passes...)</i>');
    }
    
    //update timeout (if needed)
    var nextInterval = CalculateTickInterval();
    if (nextInterval >= GAME_DATA.lastTickInterval + 1 ||
        nextInterval <= GAME_DATA.lastTickInterval - 1) {
        console.log("changing interval to: " + nextInterval);

        window.clearInterval(GAME_DATA.tickID);
        GAME_DATA.lastTickInterval = nextInterval;
        GAME_DATA.tickID = window.setInterval(GameTick, GAME_DATA.lastTickInterval);
    }
}

function FuzzifyValue(value, unit) {

    var fixedValue = "" + Math.round(value);
    var fixedUnit = ' ' + unit + ((value != 1)? 's' : '');
    
    if (unit == "wasted second") {
        if (value >= 60) {
        
        } else if (value >= 10) {
        
            var aproxValue = Math.floor(value/10);
            var remainder = (value/10.0) - (aproxValue);
                    
            if (remainder >= 0.5) {
                fixedValue = 'more than ' + LANG.tens[aproxValue - 1];
            } else {
                fixedValue = 'about ' + LANG.tens[aproxValue - 1];
            }
        } else if (value >= 5) {
            fixedValue = "several";
        } else if (value >= 3) {
            fixedValue = "a few";
        } else if (value >= 2) {
            fixedValue = "a couple";
        } else {
            fixedValue = "nothing";
            fixedUnit = '';
        }
    } else if (unit == "dt") {
    
        fixedUnit = '';
    
        if (value > 1.1) {
            fixedValue = "slightly faster than usual";
        } else if (value > 1) {
            fixedValue = "slowly";
        } else  if (value > 0.99) {
            fixedValue = "very slowly";
        } else {
            fixedValue = "excruciatingly slowly";
        }
    }    
    return '<span class="value">' + fixedValue + '</span>' + fixedUnit;
}

function SayHTML(string) {

    $('<p>' + string + '</p>').prependTo(GAME_DATA.console_el).hide().fadeIn(500).delay(60000).fadeOut(1000, function() {$(this).remove();});
    
    GAME_DATA.console_el.children().each( function( index,  element) {
        if (index > 6) {
            $(this).fadeOut(1000, function() {
                $(this).remove();
            });
        }
    });

}

function UpdateBar() {

    GAME_DATA.bar_el.empty();
    
    var bar_contents = '<span class="bank">You have saved ' + FuzzifyValue(GAME_DATA.bank, "wasted second") + '.</span>';
    
    bar_contents += '<span class="speed">Time is going by ' + FuzzifyValue(GAME_DATA.rateOfTime, "dt") + '.</span>'
    
    $(bar_contents).appendTo(GAME_DATA.bar_el);

}