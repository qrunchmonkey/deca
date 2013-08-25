
function MarketplaceItem(id, name, description, startPrice, priceFactor, visible) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startPrice = startPrice;
    this.priceFactor = priceFactor;
    this.visible = typeof visible !== 'undefined' ? visible : false;
    this.boughtCount = 0;
    this.priceOfNthItem = function(count) {
        return Math.floor(this.startPrice * Math.pow(priceFactor, count));
    }
    
    this.nextPrice = function() {
        return this.priceOfNthItem(this.boughtCount)
    }
    
    this.buy = function() {
        var priceOfThis = this.nextPrice();
        
        if (GAME_DATA.bank >= priceOfThis) {
            GAME_DATA.bank -= priceOfThis;
            GAME_DATA.inventory[this.id] += 1;
            this.boughtCount++;
            BoughtItem(this);
            if (this.priceFactor == 0) {
                RemoveMarketplaceItem(this);
            }
        } else {
            //SayHTML('<i>(You can\'t afford that. Nice try.)</i>');
        }
    }
    
    this.contents = function() {
        var ret = "";
        ret += '<span class="name">'+ this.name + '</span>';
        ret += '<span class="price">' + this.nextPrice() + '</span>';
        ret += '<span class="desc">' + this.description + '</span>';
        return ret;
    }
}