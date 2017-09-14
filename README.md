# crypto-exchange-arbitrage

### Install:
```sh
npm install
```

### Use:
```sh
node index.js --X=10000  # X is your capital in USD
```

### Output
![Output](result.png)

| Column     | |
|---|---|
| X | Initial Amount (USD) |
| Nd | Number of deposits needed |
| Nw | Number of withdrawal needed |
| totalCb | Total amount of charge spent on deposit, including remittance fee (USD)|
| Tbtc | BTC Withdrawal Charge (BTC)|
| totalCb | Total amount of charge spent on withdrawl (USD) |
| Y | Amount of fiat currency you finally receive (USD) |
| profit | profit |
| MPR | NORMINAL monthly percentage rate of profit |
| MPR | NORMINAL annual percentage rate of profit |

---

### More settings on BTCUSD.js, etc
| Variables     |                                                               |
|---------------|---------------------------------------------------------------|
| X | Initial Amount (USD) |
| Mb | Max. deposit amount in one transfer limited by bank (USD) |
| T | Bank remittance fee (USD) |
| | |
| exchange.fb   | Buy Trade Fee (%)                                             |
| exchange.Cb   | Deposit Charge (USD)                                          |
| exchange.Tbtc | BTC Withdrawal Charge (BTC)                                     |
| exchange.Mb   | Max. deposit amount in one transfer limited by exchange (USD) |
| | |
| sellExchange.fs | Sell Trade Fee (%)                                              |
| sellExchange.Cs | Fiat Withdrawal Charge (USD)                                    |
| sellExchange.Ms | Max. withdrawal amount in one transfer limited by exchange (USD) |
| sellExchange.D  | Number of days the fiat withdrawal takes                         |
| | |
