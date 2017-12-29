var CLI = require('clui'),
    clc = require('cli-color');

var Line        = CLI.Line,
    LineBuffer  = CLI.LineBuffer;
    
// constructor
function UI(options) {
  if (!(this instanceof UI)) {
    return new UI(options);
  }

  this.options = options;
  
  this.outputBuffer  = new LineBuffer({
    x: 0,
    y: 0,
    width: 'console',
    height: 'console'
  });

  this.message = new Line(this.outputBuffer)
    .column(this.options.UI.title, this.options.UI.title.length, [clc.green])
    .fill()
    .store();

  this.blankLine = new Line(this.outputBuffer)
    .fill()
    .store();

  this.cols = [20, 10, 20, 11]
  this.header = new Line(this.outputBuffer)
    .column('Timestamp', this.cols[0], [clc.cyan])
    .column('Symbol', this.cols[1], [clc.cyan])
    .column('Price', this.cols[2], [clc.cyan])
    .column('Quantity', this.cols[3], [clc.cyan])
    .fill()
    .store();

  this.line;
  this.outputBuffer.output();
};


/*
    { eventType: 'aggTrade',
      eventTime: 1514559250559,
      symbol: 'XRPETH',
      tradeId: 916488,
      price: '0.00224999',
      quantity: '100.00000000',
      firstTradeId: 1090457,
      lastTradeId: 1090457,
      time: 1514559250554,
      maker: false,
      ignored: true }

*/
UI.prototype.updateUI = function(){
  if(this.outputBuffer.lines.length > process.env.maxRows) {
    this.outputBuffer.lines.splice(3, 1)
      
  }

  
  this.outputBuffer.output();
}
UI.prototype.addTrade = function(time, symbol, tradeId, price, quantity){
  this.line = new Line(this.outputBuffer)
    .column(time.toString(), this.cols[0])
    .column(symbol.toString(), this.cols[1])
    .column(price.toString(), this.cols[2])
    .column(quantity.toString(), this.cols[3])
    .fill()
    .store();
      
  this.updateUI();
    
}



module.exports = UI;
