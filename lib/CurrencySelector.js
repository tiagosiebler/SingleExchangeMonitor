var CurrencySelector = {};

CurrencySelector.init = (selectorRaw, exchangeAPI)=>{
  /* Currency selector stuff */
  CurrencySelector.selectorRaw    = selectorRaw;  //XRP-ETH
  CurrencySelector.splitSelector  = CurrencySelector.selectorRaw.split('-');//XRP, ETH array
  CurrencySelector.key            = CurrencySelector.splitSelector.join('');//XRPETH
  CurrencySelector.asset          = CurrencySelector.splitSelector[0];//XRP
  CurrencySelector.selector       = CurrencySelector.splitSelector[1];//ETH
  
  // sockets stuff
  CurrencySelector.interval       = '30s';
  CurrencySelector.exchangeAPI    = exchangeAPI;

  // placeholders
  CurrencySelector.events     = {};
  CurrencySelector.trades     = {};
  CurrencySelector.orderBook  = {};
  CurrencySelector.sockets  = {};
  CurrencySelector.handleEvent = ()=>{};
  
  return CurrencySelector;
}
 
// start web sockets for this currency selector
CurrencySelector.startWSockets = () => {
 /*
  * WebSocket API
  *
  * Each call to onXXXX initiates a new websocket for the specified route, and calls your callback with
  * the payload of each message received.  Each call to onXXXX returns the instance of the websocket
  * client if you want direct access(https://www.npmjs.com/package/ws).
  */
  CurrencySelector.sockets.depth = CurrencySelector.exchangeAPI.WS.onDepthUpdate(
                                      CurrencySelector.key, 
                                      CurrencySelector.handleEvent);

  CurrencySelector.sockets.trade = CurrencySelector.exchangeAPI.WS.onAggTrade(
                                      CurrencySelector.key, 
                                      CurrencySelector.handleEvent);                                      
                            
  CurrencySelector.sockets.kline = CurrencySelector.exchangeAPI.WS.onKline(
                                      CurrencySelector.key, 
                                      CurrencySelector.interval, 
                                      CurrencySelector.handleEvent);
}

module.exports = CurrencySelector.init;