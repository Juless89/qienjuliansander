function messageHandler(event) {
    self.postMessage("Received: " + event.data);
}
self.addEventListener("message", messageHandler, false);


const socket = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/ltcusdt@ticker')

socket.onopen = function() {
    console.log ("Connection to server now open");

    const message = {
        type: "subscribe",
        channels: [
            "ticker",
            "heartbeat",
            {
                name: "ticker",
                product_ids: [
                    "BTC-USD"
                ]
            }
        ]
    }

    //socket.send(JSON.stringify(message))
}

socket.onmessage = function(event) {
    //console.log(event.data);
    const reply = {
        exchange: "binance",
        data: event.data
    }
    self.postMessage(reply);
}

socket.onclose = function(event) {
    console.log('Connection closed');
}