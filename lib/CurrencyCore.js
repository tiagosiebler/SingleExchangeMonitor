// constructor
function CurrencyCore(selectors, exchange, ctrl) {
  if (!(this instanceof CurrencyCore)) {
    return new CurrencyCore(selectors, exchange, ctrl);
  }
    
  if(!selectors) 
    throw "No selectors provided when loading CurrencyCore. Ensure enabledPairs is set in conf.ini!";
    
  if(!exchange) 
    throw "Undefined exchange connector. May not be able to communicate with exchange";
  
  this.selectors = selectors.split(',');
  this.currencies = {};
  this.startWSockets(exchange, ctrl);
};

CurrencyCore.prototype.startWSockets = function(exchange, ctrl){
  
  // loop through provided csv selectors, and initiate trades & orderBook sockets for each
  for(i = 0;i < this.selectors.length;i++){
    
    let selector = require('./CurrencySelector.js')(this.selectors[i], exchange);
    
    this.currencies[selector.key] = selector;
    this.currencies[selector.key].handleEvent = ctrl.events.wsEvent;
    this.currencies[selector.key].startWSockets(ctrl.events);
  }
}


module.exports = CurrencyCore;
