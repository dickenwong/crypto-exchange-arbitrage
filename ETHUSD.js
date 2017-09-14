const co = require('co');
const main = require('./main');
const argv = require('yargs').argv;


const exchanges = [
  { name: 'bitstamp',
    fb: 0.0025,
    Cb: (fiatPerTxn) => 25 + Math.min(Math.max(fiatPerTxn * 0.0005, 7.5), 300),
    Tbtc: 0,
    Mb: Infinity },
  { name: 'bitfinex',
    fb: 0.0020,
    Cb: (fiatPerTxn) => 25 + Math.max(fiatPerTxn * 0.001, 20),
    Tbtc: 0.01,
    Mb: Infinity },
];

const sellExchanges = [
  { name: 'cex', fs: 0.0020, Cs: 77, Ms: 10000, D: 8 },
];

const X = argv.X || (50000 / 7.84);
const Mb = Infinity; // 50000 / 7.84;
const Tt = 110 / 7.84;


co.wrap(main)(X, Mb, Tt, 'ETH/USD', sellExchanges[0], exchanges)
  .catch(console.error)
