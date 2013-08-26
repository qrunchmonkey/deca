var LANG = {};

LANG.intro = [
    '<strong>* You hear a door creak open behind you. *</strong><br><br><i>(Revealing a sharply dressed man in a suit.)</i>',
    '<strong>[SUIT]</strong> Oh! Hello. I didn\'t see you there.',
    '<i>(He was the one who opened the door...)</i>',
    '<strong>[SUIT]</strong> Well, since you\'re already sitting down...',
    '<strong>[SUIT]</strong> As you know, here at Decasecond International we\'ve found a way to convert wasted time directly into STUFF.',
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

LANG.internet = [
     '<strong>* You hear a grinding sound and turn around to try and identify it.*</strong>',
     '<i>(A large drill bit pokes through the wall from the other side)</i>',
     '<i>(A burly man shoves you out of the way, and runs a cable from your computer out through the hole in the wall.)</i>',
     '<strong>[CABLE GUY]</strong> Ok done. Sign here.</strong>',
     '<i>(You sign the form and your internet access is enabled.)</i>'
     ];


LANG.tens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
LANG.ones = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

LANG.qualities = [
['nondescript', 'plain', 'simple', 'grey', 'gray', 'beige', 'basic', 'government issue', 'prison grade', 'second-hand', 'counterfeit'],
['decent', 'off-white', 'plastic', 'mil-spec', 'recycled', 'biodegradable', 'chia', 'ceramic', 'cement', 'imitation leather'],
['genuine', 'aluminum', 'stainless steel', 'shiny', 'guilt-free', 'chrome-plated',  'organic', 'glass', 'wooden', 'leather'],
['crystal', 'rich, corinthian leather', 'gold', 'golden', 'shimmering', 'candy-apple red', , 'marble', 'glazed', 'gold-leafed', 'ancient', 'magical', 'hand made']
];

LANG.hobbies = ['programmer', 'redditor', 'botanist', 'chess player', 'Magic: The Gathering player', 'alchemist', 'glass blower', 'chef', 'concert pianist', 'theoretical physicist', 'internet troll', 'whittler', 'potato enthusiast', 'fan-fiction author', 'gamedev', 'SEO expert'];

LANG.hobby_levels = ['useless', 'beginner', 'amateur', 'hobbyist', 'layman', 'greenhorn', 'novice', 'trainee', 'apprentice', 'journeyman' ,'professional', 'world-class'];

LANG.tchotchke = ['figurine', 'cat figurine', 'kitten figurine', 'bear figurine', 'frog figurine', 'beetle figurine', 'VW Beetle figurine', 'Beatle figurine', 'potato figurine', 'picture', 'troll doll', 'cat statue', 'potato trophy', 'paperweight', 'stapler', 'cup', 'mug'];

LANG.clock = ['pocket watch', 'grandfather clock', 'kookoo clock', 'desktop clock', 'clock app', 'digital watch', 'calculator watch', 'sundial', 'potato clock', 'novelty clock', 'talking clock', 'atomic clock', 'wall clock'];

// [quantity] [photos] ...
LANG.cat = ['depicting a grumpy cat', 'depicting a kitten', 'of Garfield (poster size)', 'of two kittens fighting', 'of a cat that\'s been reposted hundreds of times', 'of a cat doing something adorable', 'of a cat doing something cute', 'of a box of kittens', 'of a cat sitting in a shoe', 'of a cat sitting in a cereal box', 'of 3 cats sitting in a package', 'of a cat in a cup', 'of a cat in a hat', 'of the cat in the hat', 'a cat with a post-it note on it\'s face', 'a cat taking a bath (and not enjoying it)', 'a cat taking a bath (and enjoying it)'];

LANG.RandomQuality = function(number, level) {
    if (level >= LANG.qualities.count) level = LANG.qualities.count - 1;
    
    var qualityLevel = typeof level !== 'undefined' ? level : 0;
    
    var shuffled = _.shuffle(LANG.qualities[level]);
    
    return shuffled.slice(0, number).join(" and ");
}

LANG.Pluralize = function (word, count) {
    return (count == 1)? word : (word + 's');
}
