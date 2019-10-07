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

function get_ticker(dict) {
    const url = "https://api.binance.com/api/v1/ticker/24hr?symbol=";
    const tickers = Object.keys(dict);

    for (var index in tickers) {
        const tick = tickers[index];
        const request = url + tick;

        fetch(request).then(response => response.json())
            .then(data => {
            dict[data.symbol] = data.lastPrice;
            generate_table(dict);
        }).catch(error => console.error(error))
    }
}

let dict = {
    BTCUSDT:"",
    LTCUSDT:"",
    ETHUSDT:"",
}

setInterval(
    () => {
        get_ticker(dict);
    },1000
);