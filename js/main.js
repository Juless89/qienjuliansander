function generate_table(dict) {
    var table_body = '<table class="table">';
    table_body +=   '<thead><tr><th scope="col">#</th><th scope="col">Ticker</th><th scope="col">Price</th></tr></thead>'
    table_body += '<tbody>';
    
    for(var i=0;i<Object.keys(dict).length;i++){

        const key = Object.keys(dict)[i];
        let average_price = 0

        const exchanges = Object.keys(dict[key])


        for (var index in exchanges) {
            average_price += dict[key][exchanges[index]].price;
        }

        average_price / exchanges.length;

        table_body+='<tr>';
            table_body += '<th scope="row">' + (i + 1) +'</th>';
            table_body +='<td class="field" id="' + key +'">';
            table_body += key;
            table_body +='</td>';
            table_body += '<td>' + parseFloat(average_price).toFixed(2); + '</td>';
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
            price: data.lastPrice,
            volume: data.volume,
        }
    }

    process_websocket_data(exchange, data){
        //console.log(data);
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

    ticker_to_coin(ticker) {
        if (ticker === "BTC-USD") {
            return "BTC"
        } else if (ticker === "LTC-USD") {
            return "LTC"
        } else if (ticker === "ETH-USD") {
            return "ETH"
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

    process_websocket_data(exchange, data){
        data = JSON.parse(data)
        //console.log(data);
        const price = data.price;
        const ticker = this.ticker_to_coin(data.product_id);
        console.log(exchange, ticker, price);
    }
}

class Bitstamp extends Exchange {
    
    ticker(coin) {
        if (coin === "BTC") {
            return "btcusd"
        } else if (coin === "LTC") {
            return "ltcusd"
        } else if (coin === "ETH") {
            return "ethusd"
        }
    }

    construct_query(coin) {
        const tick = this.ticker(coin);

        return this.url + tick;
    }

    process_data(coin, data) {
        this.coins[coin].bitstamp = {
            price: data.last,
            volume: data.volume
        }
    }

    process_websocket_data(exchange, data){
        //console.log(data);
    }
}

const binance = new Binance("https://api.binance.com/api/v1/ticker/24hr?symbol=", coins);
const coinbase = new CoinBase("https://api.coinbase.com/v2/prices/", coins);
const bitstamp = new Bitstamp("https://www.bitstamp.net/api/v2/ticker/", coins);

setInterval(
    () => {
        binance.get_price();
        coinbase.get_price();
        bitstamp.get_price();
    },1000
);

setInterval(
    () => {
        generate_table(coins);
        //console.log(Object.entries(coins) );
    },1000
);

function replyHandler(event) {
    const exchange = event.data.exchange;
    const data = event.data.data;

    if (exchange === "coinbase") {
        coinbase.process_websocket_data(exchange, data);
    } else if (exchange === "binance") {
        binance.process_websocket_data(exchange, data);
    } else if (exchange === "bitstamp") {
        bitstamp.process_websocket_data(exchange, data);
    }
    //console.log(event.data);
    //alert("Reply: " + event.data);
}

const webWorker = new Worker("js\\coinbase.js");
const webWorker2 = new Worker("js\\bitstamp.js");
const webWorker3 = new Worker("js\\binance.js");

webWorker.addEventListener("message", replyHandler, false);
webWorker2.addEventListener("message", replyHandler, false);
webWorker3.addEventListener("message", replyHandler, false);
