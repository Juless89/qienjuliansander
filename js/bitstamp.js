function messageHandler(event) {
    self.postMessage("Received: " + event.data);
}
self.addEventListener("message", messageHandler, false);


const socket = new WebSocket('wss://ws.bitstamp.net')

socket.onopen = function() {
    console.log ("Connection to server now open");

    let message = {
        event: "bts:subscribe",
        data: {
            channel: "live_trades_btcusd"
        }
    }

    socket.send(JSON.stringify(message))

    message = {
        event: "bts:subscribe",
        data: {
            channel: "live_trades_ethusd"
        }
    }

    socket.send(JSON.stringify(message))

    message = {
        event: "bts:subscribe",
        data: {
            channel: "live_trades_ltcusd"
        }
    }

    socket.send(JSON.stringify(message))
}

socket.onmessage = function(event) {
    //console.log(event.data);
    const reply = {
        exchange: "bitstamp",
        data: event.data
    }
    self.postMessage(reply);
}

socket.onclose = function(event) {
    console.log('Connection closed');
}