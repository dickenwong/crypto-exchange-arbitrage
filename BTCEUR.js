const co = require('co');
const main = require('./main');
const argv = require('yargs').argv;


const exchanges = [
  { name: 'bitstamp',
    fb: 0.0025,
    Cb: (fiatPerTxn) => 22 + Math.min(Math.max(fiatPerTxn * 0.0005, 7.5), 300),
    Tbtc: 0,
    Mb: Infinity },

];

const sellExchanges = [
  { name: 'cex', fs: 0.0020, Cs: 25 + 22, Ms: 10000, D: 8 },
];


const fiatRate = 9.2680;
const X = argv.X || (50000 / fiatRate);
const Mb = Infinity; //50000 / fiatRate;
const Tt = 110 / fiatRate;

co.wrap(main)(X, Mb, Tt, 'BTC/EUR', sellExchanges[0], exchanges)
  .catch(console.error)
