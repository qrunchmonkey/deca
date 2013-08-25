var GAME_DATA = {};

GAME_DATA.bank = 0;
GAME_DATA.rateOfTime = 1.0;
GAME_DATA.numberOfClocks = 0;

GAME_DATA.inventory = {};
GAME_DATA.marketplace = {};

GAME_DATA.consoleQueue = [];

function SetupGame() {
    GAME_DATA.root_el = $('#game');
    
    GAME_DATA.root_el.empty();
    
    GAME_DATA.bar_el = $('<div id="game_bar">Time: None</div>').appendTo(GAME_DATA.root_el);

    GAME_DATA.console_el =$('<div id="game_console"></div>').appendTo(GAME_DATA.root_el);
    
    GAME_DATA.menu_el = $('<div id="game_menu"></div>').appendTo(GAME_DATA.root_el);

    GAME_DATA.window_el = $('<div id="game_window">Stuff!</div>').appendTo(GAME_DATA.root_el);

    //TODO: load stuff here
    
    SetupMarketplace();
    UpdateMenu();
    UpdateBar();
    UpdateMainWindow()
    StartGame();
}

function AddMarketplaceItem(item) {
    if (!GAME_DATA.marketplace[item.id]) {
        GAME_DATA.marketplace[item.id] = item;
        if (!GAME_DATA.inventory[item.id]) {
            GAME_DATA.inventory[item.id] = 0;
        }
        
        var item_html    = '<div class="item" id="' + item.id + '">';
        item_html       += item.contents();
        item_html       += '</div>';
        
        $(item_html).appendTo(GAME_DATA.menu_el).click(function() {
            item.buy();
        });
    }
}

function RemoveMarketplaceItem(item) {
    delete GAME_DATA.marketplace[item.id];
    $('#' + item.id).remove();
}

function SetupMarketplace() {
    AddMarketplaceItem(new MarketplaceItem(
                                            "clock", /* id */
                                            "Clock", /* name */
                                            "Time goes slower but is more valuable. As they say, 'A watched clock never boils.'", /* description */
                                            6, /* start price */
                                            1.1, /* price factor [$ * (f^n)] */
                                            true /* visible */
                                            ));
                                            
    AddMarketplaceItem(new MarketplaceItem(
                                            "tchotchke", /* id */
                                            "Tchotchke", /* name */
                                            "Looking at things might help time go faster.", /* description */
                                            12, /* start price */
                                            1.1, /* price factor [$ * (f^n)] */
                                            true /* visible */
                                            ));
    
    AddMarketplaceItem(new MarketplaceItem(
                                            "computer", /* id */
                                            "Computer", /* name */
                                            "Unlocks new and exciting ways of wasting time.", /* description */
                                            45, /* start price */
                                            0 /* price factor [$ * (f^n)] */
                                            ));
                                            

}

function BoughtItem(item) {
    var priceMagnitude = Math.min(5,Math.round((Math.log(item.nextPrice())/Math.LN10) -     (Math.log(item.startPrice)/Math.LN10)))
    if (item.id == "tchotchke") {
        var tch = _.shuffle(LANG.tchotchke)[0];
        SayHTML('<i>(You add a new ' + LANG.RandomQuality(1,priceMagnitude) + ' ' + tch + ' to your collection)</i>');
    } else if (item.id == "computer") {
        GAME_DATA.consoleQueue = GAME_DATA.consoleQueue.concat(LANG.computer);
    } else{        
        SayHTML('<i>(You add a new ' + LANG.RandomQuality(1,priceMagnitude) +' ' + item.name + ' to your collection)</i>');
    }
    
    
    $('#' + item.id).html(item.contents());
    UpdateMenu();
    UpdateMainWindow()
    UpdateBar();
}


function StartGame() {
    /* TODO: By the time this is called from SetupGame() I should have loaded any saved game data */
    
    
    GAME_DATA.consoleQueue = GAME_DATA.consoleQueue.concat(LANG.intro);
    
    //this way the game starts fast and then figures out the interval from there.
    GAME_DATA.lastTickInterval = 0;
    GAME_DATA.tickID = window.setInterval(GameTick, 2000);
}

function CalculateTickInterval() {
    GAME_DATA.rateOfTime = 1.0 * Math.pow(0.98, GAME_DATA.inventory["clock"]) * Math.pow(1.1, GAME_DATA.inventory["tchotchke"]);
    
    return 10000 * (1 / GAME_DATA.rateOfTime); 
}

function CalculateProfitPerTick() {
    return 1 + (GAME_DATA.inventory["clock"]/2.0);
}


function GameTick() {
    console.log("tick");
    //update game state
    GAME_DATA.bank += CalculateProfitPerTick();
    
    //update UI state
    UpdateBar();
    UpdateMenu();

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
    var fixedUnit = ' ' + LANG.Pluralize(unit, value);
    
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
        } else  if (value > 0.90) {
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

function UpdateMenu() {
    _.forEach(GAME_DATA.marketplace, function(value, key, list) {
        var el = $('#' + value.id);
        var avaliable = (GAME_DATA.bank >= value.nextPrice())
        if (avaliable != el.hasClass("enabled")) el.toggleClass("enabled");
    });
}

function UpdateMainWindow() {
     GAME_DATA.window_el.empty();
 
     var including = "";
     _.forEach(GAME_DATA.inventory, function(value, key, list) {
        if (value > 0) {
            var q = LANG.RandomQuality(1, Math.min(4, Math.floor(value/10)));
            including += '' + value + ' ' + q + ' ' + LANG.Pluralize(key, value) + ', ';
        }
     });
 
    if (including.length > 0) {
        including = including.slice(0,-2) + '.'
    } else {
        var nothing = ['nothing at all.', 'large quantities of unused space.', 'nothing but an echo.', 'nothing whatsoever.'];
        including = _.shuffle(nothing)[0];
    }
 
    var desc = "<p>A vast, " + LANG.RandomQuality(2, 2) + ' room containing ' + including + '</p>';
    
    $(desc).appendTo(GAME_DATA.window_el);
 
}