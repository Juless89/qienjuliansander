function generate_table(dict) {
    var table_body = '<table class="table">';
    table_body +=   '<thead><tr><th scope="col">#</th><th scope="col">Ticker</th><th scope="col">Price</th></tr></thead>'
    table_body += '<tbody>';
    
    for(var i=0;i<Object.keys(dict).length;i++){
        const key = Object.keys(dict)[i];
        table_body+='<tr>';
        //for(var j=0;j<this.x;j++){
            table_body += '<th scope="row">' + (i + 1) +'</th>';
            table_body +='<td class="field" id="' + key +'">';
            table_body += key;
            table_body +='</td>';
            table_body += '<td>' + parseFloat(dict[key]).toFixed(2); + '</td>';
        //}
        table_body+='</tr>';
    }
    table_body+='</table>';

    $('#tableDiv').html(table_body);
}

let coins = {
    BTC: {},
    LTC: {},
    ETH: {},
}

class Exchange {
    constructor(url, coins){
        this.url = url;
        this.coins = coins;
    }

    get_price() {
        const coins = Object.keys(this.coins);
    
        for (var index in coins) {
            const coin = coins[index]

            const request = this.construct_query(coin);
    
            fetch(request).then(response => response.json())
                .then(data => {
                this.process_data(coin, data);
                //console.log(data);
            }).catch(error => console.error(error))
        }
    }
}

class Binance extends Exchange {
    construct_query(coin) {
        const tick = this.ticker(coin);

        return this.url + tick;
    }

    ticker(coin) {
        if (coin === "BTC") {
            return "BTCUSDT"
        } else if (coin === "LTC") {
            return "LTCUSDT"
        } else if (coin === "ETH") {
            return "ETHUSDT"
        }
    }

    process_data(coin, data) {
    this.coins[coin].binance = {
            price: data.lastPrice
        }
    }
}

class CoinBase extends Exchange {
    
    ticker(coin) {
        if (coin === "BTC") {
            return "BTC-USD"
        } else if (coin === "LTC") {
            return "LTC-USD"
        } else if (coin === "ETH") {
            return "ETH-USD"
        }
    }

    construct_query(coin) {
        const tick = this.ticker(coin);

        return this.url + tick + "/sell";
    }

    process_data(coin, data) {
        this.coins[coin].coinbase = {
                price: data.data.amount
            }
        }
}

const binance = new Binance("https://api.binance.com/api/v1/ticker/24hr?symbol=", coins);
const coinbase = new CoinBase("https://api.coinbase.com/v2/prices/", coins);

setInterval(
    () => {
        binance.get_price();
        coinbase.get_price();
    },1000
);

setInterval(
    () => {
        generate_table(coins);
        console.log(coins);
    },1000
);