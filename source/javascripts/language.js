var LANG = {};

LANG.intro = [
    '<strong>* You hear a door creak open behind you. *</strong><br><br><i>(Revealing a sharply dressed man in a suit.)</i>',
    '<strong>[SUIT]</strong> Oh! Hello. I didn\'t see you there.',
    '<i>(He was the one who opened the door...)</i>',
    '<strong>[SUIT]</strong> Well, since you\'re already sitting down...',
    '<strong>[SUIT]</strong> As you know, here at Microsecond International we\'ve found a way to convert wasted time directly into STUFF.',
    '<strong>[SUIT]</strong> That\'s right! Stuff! Real, actual things.<br><br><i>(Who asked you?)</i>',
    '<strong>[SUIT]</strong> Yuuup! It\'s basically the American Dream on crack.',
    '<strong>[SUIT]</strong> Anyway, Time\'s not going to waste itself. Get slacking!',
    '<strong>* The door slams shut behind you. *</strong>'
    ];

LANG.computer = [
    '<strong>* You quickly tear the computer out of it\'s packaging. *</strong>',
    '<strong>* You hear a distinctive chime. *</strong><br><br><i>(The computer whirrs to life.)</i>',
    '<i>(Looking over your new options, you come to a shocking realization. The entire operating system is powered by microtransactions!)</i>'
];

LANG.tens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

LANG.qualities = [
['nondescript', 'plain', 'simple', 'grey', 'gray', 'beige', 'basic', 'government issue', 'prison grade', 'second-hand', 'counterfeit'],
['decent', 'off-white', 'plastic', 'mil-spec', 'recycled', 'biodegradable', 'chia', 'ceramic', 'cement', 'imitation leather'],
['genuine', 'aluminum', 'stainless steel', 'shiny', 'guilt-free', 'chrome-plated',  'organic', 'glass', 'wooden', 'leather'],
['crystal', 'rich, corinthian leather', 'gold', 'golden', 'shimmering', 'candy-apple red', , 'marble', 'glazed', 'gold-leafed', 'ancient', 'magical', 'hand made']
];


LANG.tchotchke = ['figurine', 'cat figurine', 'kitten figurine', 'bear figurine', 'frog figurine', 'beetle figurine', 'VW Beetle figurine', 'Beatle figurine', 'potato figurine', 'picture', 'troll doll', 'cat statue', 'potato trophy', 'paperweight', 'stapler', 'cup', 'mug'];


LANG.RandomQuality = function(number, level) {
    if (level >= LANG.qualities.count) return "";
    
    var qualityLevel = typeof level !== 'undefined' ? level : 0;
    
    var shuffled = _.shuffle(LANG.qualities[level]);
    
    return shuffled.slice(0, number).join(" and ");
}

LANG.Pluralize = function (word, count) {
    return (count == 1)? word : (word + 's');
}