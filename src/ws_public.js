function ws_public_connect() {
    ws_pub = new WebSocket(apiUrl_public);

    ws_pub.onopen = function(event) {
        output_txt('Public WebSocket is open now.');
        subscribeOrderBook(instId);
    };

    ws_pub.onclose = function(event) {
        output_txt('Public WebSocket is closed now.');
        reconnectPublic();
    };

    ws_pub.onerror = function(error) {
        output_txt('Public WebSocket error observed: ' + JSON.stringify(error));
    };

    ws_pub.onmessage = function(event) {
        let data = JSON.parse(event.data);
        const fcl = "</font>";
        if(data.arg && data.arg.channel === "books5" && event === "subscribe")
            output_txt('Orderbook data: ' + JSON.stringify(data));
        else if(data.arg && data.arg.channel === "books5" && data.event !== "subscribe"){
            last_book = Date.now();
            /*let max_precision = 0;
            function precision(a) {
                const pos = a.indexOf('.');
                if(pos == -1) return 0;
                else return a.length - 1 - pos;
                }
            data.data[0].asks.forEach(x => {
                max_precision = Math.max(max_precision, precision(x[0]));
            });
            data.data[0].bids.forEach(x => {
                max_precision = Math.max(max_precision, precision(x[0]));;
            });*/
            let book_html = "";
            book_html += ask_color;
            for(let i = data.data[0].asks.length - 1; i > -1; i--)
                book_html += qtyatprice_color + data.data[0].asks[i][1] + fcl + " .. " + data.data[0].asks[i][0] + "<br>";
            book_html += fcl
            book_html += "<br>";
            book_html += bid_color;
            for(let i = 0; i < data.data[0].bids.length - 1; i++)
                book_html += qtyatprice_color + data.data[0].bids[i][1] + fcl + " .. " + data.data[0].bids[i][0] + "<br>";
            book_html += "</font>"
            document.getElementById("_book").innerHTML = book_html;
            book_value = data;
            //console.log("book: "+JSON.stringify(data));
            //output_txt('Orderbook data: ' + JSON.stringify(data)); //handleOrderBook(data);
        } else {
            output_txt('Public received: ' + JSON.stringify(data));
        }
    };
}

function reconnectPublic() {
    if(reconnect_public_bool){
        output_txt('reconnecting public WebSocket in ' + reconnect_time_public + ' seconds...');
        setTimeout(() => {
            if(ws_pub.readyState === WebSocket.CLOSED){
                ws_public_connect();
                setTimeout(() => checkPublicConnection(), checkConnectionDelay);
            }
        }, reconnect_time_public * 1000);
    }
}

function checkPublicConnection() {
    if(ws_pub.readyState !== WebSocket.OPEN){
        output_txt('public WebSocket connection failed.');
        reconnectPublic();
    }
}

function subscribeOrderBook(instId) {
    const subscribeMessage = `{
        "op": "subscribe",
        "args": [{
            "channel": "books5",
            "instId": "` + instId + `"
        }]
    }`;
    ws_pub.send(subscribeMessage);
}
