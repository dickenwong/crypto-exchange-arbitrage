const co = require('co');
const ccxt = require('ccxt');
const Table = require('cli-table');

module.exports = function* main(X, Mb, Tt, symbol, sellExch, exchanges, _print = true) {
  const fs = sellExch.fs;
  const Ms = sellExch.Ms;
  const Cs = sellExch.Cs;
  const D = sellExch.D;

  const sellExchTick = yield fetchTick(sellExch.name, symbol);
  const Fxs = sellExchTick.bid;

  const results = yield exchanges.map((exchInfo) => {
    return fetchTick(exchInfo.name, symbol)
      .then(tick => {
        const Fxb = tick.ask;
        const depositCount = Math.max(1, Math.ceil(X / Math.min(exchInfo.Mb, Mb)));
        const _Cb = typeof exchInfo.Cb === 'function'
          ? exchInfo.Cb(X / depositCount)
          : exchInfo.Cb;
        const totalCb = (_Cb + Tt) * depositCount;
        const Bb = (X - totalCb) * (1 - exchInfo.fb) / Fxb;
        const _Tbtc = typeof exchInfo.Tbtc === 'function' ? exchInfo.Tbtc(Bb) : exchInfo.Tbtc;
        const fiatInSellExch = (Bb - _Tbtc) * (1 - fs) * Fxs;
        const withdrawalCount = Ms === Infinity ? 1 : Math.ceil(fiatInSellExch / Ms);
        const _Cs = typeof Cs === 'function' ? Cs(fiatInSellExch) : Cs;
        const totalCs = _Cs * withdrawalCount;
        const Y = fiatInSellExch - totalCs;
        const percentProfit = Y / X - 1;
        // const MPR = Math.pow(percentProfit + 1, 30 / D) - 1;
        // const APR = Math.pow(percentProfit + 1, 365 / D) - 1;
        const MPR = percentProfit * 30 / D;
        const APR = percentProfit * 365 / D;
        return [
          exchInfo.name,
          Fxb,
          toDecimal((Fxs / Fxb - 1) * 100, 2) + '%',
          depositCount,
          withdrawalCount,
          toDecimal(totalCb, 2),
          Number(toDecimal(_Tbtc, 5)),
          toDecimal(totalCs, 2),
          toDecimal(Y, 2),
          toDecimal(percentProfit * 100, 2) + '%',
          toDecimal(MPR * 100, 2) + '%',
          toDecimal(APR * 100, 1) + '%',
        ];
      });
  });

  if (_print) {
    const table1 = new Table({ head: ['Exchange', 'bid', 'X'] });
    table1.push([sellExch.name, sellExchTick.bid, toDecimal(X, 2)]);

    const table2 = new Table({
      head: [
        'Exchange', 'ask', '% diff', 'Nd', 'Nw', 'totalCb', 'Tbtc', 'totalCs',
        'Y', 'profit', 'MPR', 'APR',
      ],
    });
    table2.push(...results);

    console.log(table1.toString());
    console.log(table2.toString());
  }

  return { X, Fxs, results };
}


function fetchTick(exchName, symbol) {
  if (exchName === 'coinsbank') {
    if (symbol !=='BTC/USD') throw new Error('No such market in Coinsbank');
    const request = require('request-promise');
    const option = {
      url: 'https://coinsbank.com/api/bitcoincharts/orderbook/BTCUSD',
      json: true,
    };
    return request.get(option)
      .then((orders) => {
        const ask = Math.min(...orders.asks.map(([price]) => price));
        const bid = Math.max(...orders.bids.map(([price]) => price));
        return { bid, ask };
      });
  }
  const exchange = ccxt[exchName]();
  return exchange.fetchTicker(symbol);
}


function toDecimal(val, decimalPlaces = 2) {
  const x = Math.pow(10, decimalPlaces);
  return parseFloat(Math.round(Number(val) * x) / x).toFixed(decimalPlaces);
}
