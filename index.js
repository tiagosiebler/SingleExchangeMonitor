var env = require('node-env-file');
env(__dirname + '/.keys');
env(__dirname + '/conf.ini');

if (!process.env.binance_key || !process.env.binance_secret) {
  console.log('Error: Specify your binance API settings in a file called ".keys".');
  process.exit(1);
}

const api = require('binance');
const binanceRest = new api.BinanceRest({
    key: process.env.binance_key,
    secret: process.env.binance_secret,
    timeout: parseInt(process.env.restTimeout), // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: parseInt(process.env.restRecvWindow), // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: process.env.restBeautify != 'true'
});

var activePairs, exchangeAPI = {};

// make more dynamic in future
if(process.env.activeExchange == 'binance'){
  activePairs = process.env.binancePairs;
  exchangeAPI.WS = new api.BinanceWS();
}

// initialise root controller
var ctrl          = {};
    ctrl.options  = {
      UI: {
        title: 'Live Binance Trades - ' + activePairs
      }
    },
    ctrl.UI       = require('./lib/UI.js')(ctrl.options),
    ctrl.events   = {};

// make this a module, later...
// handler for WS callbacks
ctrl.events.wsEvent = (event) => {
  if(event.eventType){
    var type = event.eventType;
    if(type == 'depthUpdate'){
  
    }else if(type == 'aggTrade'){
      ctrl.UI.addTrade(event.eventTime, event.symbol, event.tradeId, event.price, event.quantity);
      // console.log("handle.wsEvent().aggTrade(): ", event);
    }else{
      //console.log("handle.wsEvent(): ", event);
    }
  }
},

// load up all currencies and initialise websockets for each
ctrl.currencyCore         = require('./lib/CurrencyCore.js')(activePairs, exchangeAPI, ctrl);
    

/*
 * onUserData requires an instance of BinanceRest in order to make the necessary startUserDataStream and
 * keepAliveUserDataStream calls.  The webSocket instance is returned by promise rather than directly
 * due to needing to request a listenKey from the server first.
 */
exchangeAPI.WS.onUserData(binanceRest, (data) => {
  // console.log(data);
}, 60000) // Optional, how often the keep alive should be sent in milliseconds
.then((ws) => {
  // websocket instance available here
});