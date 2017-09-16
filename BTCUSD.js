const co = require('co');
const main = require('./main');
const argv = require('yargs').argv;

// exchange.fb -> Buy Trade Fee (%)
// exchange.Cb -> Deposit Charge (USD)
// exchange.Tbtc -> BTC Withdraw Charge (BTC)
// exchange.Mb -> Max. deposit amount in one transfer limited by exchange (USD)

// sellExchange.fs -> Sell Trade Fee (%)
// sellExchange.Cs -> Withdraw Charge (USD)
// sellExchange.Ms -> Max. withdrawl amount in one transfer limited by exchange (USD)
// sellExchange.D -> Number of days the USD withdrawal takes


// X -> Initial Amount (USD)
// Mb -> Max. deposit amount in one transfer limited by bank (USD)
// T -> Bank remittance fee (USD)


const exchanges = [
  { name: 'bitstamp', fb: 0.0025, Cb: 25 + 7.5,  Tbtc: 0,      Mb: Infinity },
  { name: 'bitfinex', fb: 0.0020, Cb: 25 + 20,   Tbtc: 0.0004, Mb: Infinity },
  { name: 'gemini',   fb: 0.0025, Cb: 25 + 0,    Tbtc: 0,      Mb: Infinity },
  { name: 'hitbtc',   fb: 0.0010, Cb: 25 + 45,   Tbtc: 0.0003, Mb: Infinity },
  { name: 'exmo',     fb: 0.0020, Cb: 25 + 20,   Tbtc: 0.001,  Mb: Infinity },
  { name: 'coinsbank',
    fb: 0.0050,
    Cb: 0,
    Tbtc: (Bb) => Math.min(Math.max(Bb * 0.005, 0.005), 1),
    Mb: Infinity },
  { name: 'gatecoin', fb: 0.0035, Cb: 7 - (110-80) / 7.84, Tbtc: 0.000,  Mb: 50000 },
];

const sellExchanges = [
  { name: 'cex', fs: 0.0020, Cs: 77, Ms: 10000, D: 8 },
  { name: 'bitbay',
    fs: 0.0043,
    Cs: (usd) => 1.25 + Math.min(Math.max(5.2, usd * 0.0035), 45) + 25,
    Ms: Infinity,
    D: 8 },
  { name: 'bitbays',
    fs: 0.0025,
    Cs: (usd) => 0.015 * usd + 25,
    Ms: Infinity,
    D: 4 },
];

const X = argv.X || (50000 / 7.84);
const Mb = Infinity; // 50000 / 7.84;
const Tt = 110 / 7.84;


function calculate(_print = true) {
  return co.wrap(main)(
    X, Mb, Tt, 'BTC/USD', sellExchanges[0], exchanges, _print);
}

if (require.main === module) {
  calculate().catch(console.error);
}

module.exports = calculate;
