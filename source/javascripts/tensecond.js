var GAME_DATA = {};

GAME_DATA.bank = 0;

GAME_DATA.inventory = {};
GAME_DATA.marketplace = {};

GAME_DATA.consoleQueue = [];
GAME_DATA.hobbies = {};

GAME_DATA.rateOfTime = function() {
    
    var hobbyMultiplier = 1;
    _.forEach(GAME_DATA.hobbies, function(value, key, list) {
        hobbyMultiplier *= Math.pow(1.05, value);
    });
    
    var lightCount = GAME_DATA["light"] || 0;
    var lightMultiplier = 1 * Math.pow(1.1, lightCount);

    return 1.0 * Math.pow(0.98, GAME_DATA.inventory["clock"]) * Math.pow(1.07, GAME_DATA.inventory["tchotchke"]) * hobbyMultiplier * lightMultiplier;
};


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
        SayHTML('<i>(You got a new computer!)</i>');
        
        AddMarketplaceItem(new MarketplaceItem(
                                            "internet", /* id */
                                            "Internet Access", /* name */
                                            "Unlocks new and exciting ways of wasting time.", /* description */
                                            90, /* start price */
                                            0 /* price factor [$ * (f^n)] */
                                            ));
        
        AddMarketplaceItem(new MarketplaceItem(
                                            "spreadsheet", /* id */
                                            "Spreadsheets", /* name */
                                            "Waste time looking at numbers.", /* description */
                                            90, /* start price */
                                            1.5 /* price factor [$ * (f^n)] */
                                            ));
        
        AddMarketplaceItem(new MarketplaceItem(
                                            "light", /* id */
                                            "Blinkenlichten", /* name */
                                            "A light that blinks to let you know something is happening.", /* description */
                                            120, /* start price */
                                            1.5 /* price factor [$ * (f^n)] */
                                            ));
                                            
    } else if (item.id == "internet") {
        GAME_DATA.consoleQueue = GAME_DATA.consoleQueue.concat(LANG.internet);
        var brokenClocks = Math.round(Math.min(GAME_DATA.inventory["clock"], Math.random() * 5));
        var brokenTch = Math.round(Math.min(GAME_DATA.inventory["tchotchke"], Math.random() * 3));
        if (brokenTch > 0 ||  brokenClocks > 0) {
            GAME_DATA.inventory["clock"] -= brokenClocks;
            GAME_DATA.inventory["tchotchke"] -= brokenTch;
            var a = [];
            if (brokenClocks) a.push('' + brokenClocks + ' ' + LANG.Pluralize("clock", brokenClocks));
            if (brokenTch) a.push('' + brokenTch + ' ' + LANG.Pluralize("tchotchke", brokenTch));
            var brokenPhrase = '<i>(As you turn around, you notice he broke ' + a.join(' and ') + '.)</i>';
            GAME_DATA.consoleQueue.push(brokenPhrase);
        }
        item.name = "Cable Modem";
        SayHTML('<i>(They\'ll send someone shortly.)</i>');
        
        AddMarketplaceItem(new MarketplaceItem(
                                            "cat", /* id */
                                            "Cat Pictures", /* name */
                                            "A picture of a cute cat to keep you company.", /* description */
                                            120, /* start price */
                                            1.1 /* price factor [$ * (f^n)] */
                                            ));
        
        AddMarketplaceItem(new MarketplaceItem(
                                            "hobby", /* id */
                                            "Learn a Hobby", /* name */
                                            "Waste time learning how to do something useless.", /* description */
                                            300, /* start price */
                                            1.1 /* price factor [$ * (f^n)] */
                                            ));
                                            
    } else if (item.id == "spreadsheet") {
        item.description = "More advanced spreadsheets allow you to waste time more efficiently.";
        SayHTML('<i>(You have unlocked another page for your spreadsheets)</i>');
    } else if (item.id == "hobby") {
        AchiveHobby(item);
    } else{        
        SayHTML('<i>(You add a new ' + LANG.RandomQuality(1,priceMagnitude) +' ' + item.name + ' to your collection)</i>');
    }
    
    
    $('#' + item.id).html(item.contents());
    UpdateMenu();
    UpdateMainWindow()
    UpdateBar();
}

function AchiveHobby(item) {
    var elegibleHobbies = _.filter(LANG.hobbies, function (hobby) {GAME_DATA.hobbies[hobby] < LANG.hobby_levels.length - 1 } );
    var hobby = elegibleHobbies[Math.floor(elegibleHobbies.length * Math.random())];
    
    var level = GAME_DATA.hobbies[hobby] || 0;
    level++;
    
    var phrase = '<i>(You are now a ' + LANG.hobby_levels[level] + ' ' + hobby + '.)</i>';
    
    if (_.filter(LANG.hobbies, function (hobby) {GAME_DATA.hobbies[hobby] < LANG.hobby_levels.length - 1 } ).length == 0) {
        phrase += '<br><br><i>(You can\t learn any more hobbies.)</i>';
        RemoveMarketplaceItem(item);
    }
}

function StartGame() {
    /* TODO: By the time this is called from SetupGame() I should have loaded any saved game data */
    
    
    GAME_DATA.consoleQueue = GAME_DATA.consoleQueue.concat(LANG.intro);
    
    //this way the game starts fast and then figures out the interval from there.
    GAME_DATA.lastTickInterval = 0;
    GAME_DATA.tickID = window.setInterval(GameTick, 2000);
}

function CalculateTickInterval() {
    return Math.max(500, 10000 * (1 / GAME_DATA.rateOfTime())); 
}

function CalculateProfitPerTick() {
    var spreadsheets = GAME_DATA.inventory["spreadsheet"] || 0;
    var computers = GAME_DATA.inventory["computer"] || 0;
    var cats = GAME_DATA.inventory["cat"] || 0;
    
    var hobbyProfit = 0;
    _.forEach(GAME_DATA.hobbies, function(value, key, list) {
        hobbyProfit += 5 * Math.pow(1.1, value);
    });
    
    return (1 + (GAME_DATA.inventory["clock"]/2.0) + (spreadsheets * 4) + hobbyProfit + (cats * 6.66)) * (1 + (computers/10.0));
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
    
    //update the light
    $('.light').finish().animate({"opacity":1}, {duration: 400, easing: "easeInExpo"}).animate({"opacity":0},{duration:(nextInterval - 400), easing: "easeOutExpo"});
}

function FuzzifyValue(value, unit) {

    var fixedValue = "" + Math.round(value);
    var fixedUnit = ' ' + LANG.Pluralize(unit, value);
    
    if (unit == "wasted second") {
        if (value >= 60) {
            value /= 60;
            var fixedUnit = ' ' + LANG.Pluralize("wasted minute", Math.floor(value));
            
            if (value >= 100) {
            } else if (value >= 10) {
                var aproxValue = Math.floor(value/10);
                var remainder = (value/10.0) - (aproxValue);
                    
                if (remainder >= 0.5) {
                    fixedValue = 'more than ' + LANG.tens[aproxValue - 1];
                } else {
                    fixedValue = 'about ' + LANG.tens[aproxValue - 1];
                }
            } else {
                var aproxValue = Math.floor(value);
                var remainder = (value) - (aproxValue);
                    
                if (remainder >= 0.5) {
                    fixedValue = 'more than ' + LANG.ones[aproxValue - 1];
                } else {
                    fixedValue = 'about ' + LANG.ones[aproxValue - 1];
                }
            }
            
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
        } else if (value > 1) {
            fixedValue = "one";
            fixedUnit = ' ' + unit;
        } else if (value > 0.75) {
            fixedValue = "less than one";
            fixedUnit = ' ' + unit;
        } else {
            fixedValue = "nothing";
            fixedUnit = '';
        }
    } else if (unit == "dt") {
    
        fixedUnit = '';
        if (value > 2.5) {
            fixedValue = "alarmingly quickly";
        }else  if (value > 1.9) {
            fixedValue = "rather quickly";
        }else if (value > 1.7) {
            fixedValue = "faster than usual";
        } else if (value > 1.5) {
            fixedValue = "slightly faster than usual";
        }else if (value > 1.2) {
            fixedValue = "normally";
        } else if (value > 1) {
            fixedValue = "slowly";
        } else  if (value > 0.90) {
            fixedValue = "very slowly";
        } else if (value > 0.80) {
            fixedValue = "excruciatingly slowly";    
        } else if (value > 0.6) {
            fixedValue = "like molasses";
        } else {
            fixedValue = "slower than molasses";
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
    
    bar_contents += '<span class="speed">Time is going by ' + FuzzifyValue(GAME_DATA.rateOfTime(), "dt") + '.</span>'
    
    $(bar_contents).appendTo(GAME_DATA.bar_el);
}

function UpdateMenu() {
    _.forEach(GAME_DATA.marketplace, function(value, key, list) {
        var el = $('#' + value.id);
        var avaliable = (GAME_DATA.bank >= value.nextPrice())
        if (avaliable != el.hasClass("enabled")) el.toggleClass("enabled");
    });
}

var roomdesc;

function UpdateMainWindow() {
     GAME_DATA.window_el.empty();
 
    if (!roomdesc) roomdesc = LANG.RandomQuality(1, 0);
 
     var including = "";
     _.forEach(GAME_DATA.inventory, function(value, key, list) {
        if (value > 0 && key != "hobby") {
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
 
    var desc = "<p>You are in a vast, " + roomdesc + ' room containing ' + including + '</p>';
    
    $(desc).appendTo(GAME_DATA.window_el);
    
    if (GAME_DATA.inventory["computer"]) {
        var computer = '<div id="computer">'
        
        if (GAME_DATA.inventory["light"]) {
            computer += '<div id="lights">'
            for (var i = 0; i < GAME_DATA.inventory["light"]; i++) {
                computer += '<div class="light"></div>';
            }
            computer += '</div>';
        }
        
        if (GAME_DATA.inventory["spreadsheet"]) {
            var profitPerSecond = CalculateProfitPerTick()/(CalculateTickInterval()/1000);
            //profitPerSecond = Math.floor(profitPerSecond);
            
            if (GAME_DATA.inventory["spreadsheet"] > 2) {
                computer += '<span class="spreadsheet">According to your advanced spreadsheets, you are saving exactly ';
                computer += (Math.round(profitPerSecond * 100)/100.0) + ' wasted seconds every second.';
            } else {
                computer += '<span class="spreadsheet">According to your spreadsheets, you are saving approximately ';
                computer += FuzzifyValue(profitPerSecond, "wasted second") + '  every second.</span>';
            }            
            
        } else {
            computer += '<p>There is nothing but flashing ads on your computer\'s screen.</p>';
        }
        
        if (!GAME_DATA.inventory["internet"]) {
            computer += '<p>You can\'t do much without internet access.</p>';
        }
        
        computer += '</div>'
        
        $(computer).appendTo(GAME_DATA.window_el);
    }
 
}