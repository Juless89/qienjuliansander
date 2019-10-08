function messageHandler(event) {
    self.postMessage("Received: " + event.data);
}
self.addEventListener("message", messageHandler, false);


const socket = new WebSocket('wss://ws-feed.pro.coinbase.com')

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

    socket.send(JSON.stringify(message))
}

socket.onmessage = function(event) {
    //console.log(event.data);
    const reply = {
        exchange: "coinbase",
        data: event.data
    }
    self.postMessage(reply);
}

socket.onclose = function(event) {
    console.log('Connection closed');
}