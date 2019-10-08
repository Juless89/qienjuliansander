function genTable(){
    var table_body = '<table class="table">';

    // lijst krijgen van alle exchangers, om de column headers te kunnen maken 
    var exchange_array = ["coinbase", "binance", "bitstamp"];

    // lijst krijgen van alle currencies, om de row names te kunnen maken
    var currency_array = ["BTC", "ETH", "LTC"];

    //table head maken
    var table_header = '<thead><tr><th scope="col">#</th><th scope="col">Ticker</th>'
    exchange_array.forEach(function(element){ // element is bijv. CoinBase, Binance etc.
        element  = element[0].toUpperCase() + element.slice(1); 
        table_header += '<th scope="col">' + element + '</th>';
    })
    table_header += '</tr></thead>';
    table_body += table_header;
    table_body += '<tbody>';

    //table rows aanmaken, + id per veld toevoegen
    for (var x=0;x<currency_array.length;x++){  //lopen over currencies
        var curr = currency_array[x];
        table_body+='<tr>';
        table_body += '<th scope="row">' + (x + 1) +'</th>';
        table_body +='<td class="field" id="' + curr +'">';
        table_body += curr;
        table_body +='</td>';
        for(var i=0;i<exchange_array.length;i++){ // lopen over exchangers
            var exch = exchange_array[i];
            var fieldId = exch + "-" + curr;
            table_body += '<td id=' + fieldId + '></td>';
        }
        table_body+='</tr>';
    }
    table_body+='</table>';

    $('#tableDiv2').html(table_body);
}

genTable();