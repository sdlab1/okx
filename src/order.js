function ws_order(instId, size, side) {
    if (!book_value || !book_value.data || !book_value.data[0]) {
        output_txt('Error: No book value available for placing order.');
        return;
    }
    let price;
    if (side === buy) {
        // Use the best ask price for buying
        price = book_value.data[0].bids[0][0];
    } else if (side === sell) {
        // Use the best bid price for selling
        price = book_value.data[0].asks[0][0];
    } else {
        output_txt('Error: Invalid side.');
        return;
    }
    const order = {
        op: "order",
        args: [
            {
                instId: instId,
                tdMode: 'cross', // or 'isolated' depending on your margin mode
                side: side,
                ordType: 'limit', // or 'market', 'stop', etc.
                sz: size.toString(),
                px: price.toString()
            }
        ]
    };

    ws.send(JSON.stringify(order));
    console.log('Order placed via WebSocket:', order);
}
// await order("UNI-USDT-SWAP", 10, sell); // Example sell order for 10 UNI
async function order(instId, size, side) {
    if (!book_value || !book_value.data || !book_value.data[0]) {
        output_txt('Error: No book value available for placing order.');
        return;
    }
    let price;
    if (side === buy) {
        // Use the best ask price for buying
        price = book_value.data[0].bids[0][0];
    } else if (side === sell) {
        // Use the best bid price for selling
        price = book_value.data[0].asks[0][0];
    } else {
        output_txt('Error: Invalid side.');
        return;
    }
    const url_place_order = '/api/v5/trade/order';
    const timestamp = new Date().toISOString();
    const posSide = side === buy ? "long" : "short"; // Determine position side based on order type
    const sideStr = side === buy ? "buy" : "sell"; // Determine side string for API call
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'POST' + url_place_order + JSON.stringify({
        instId: instId,
        tdMode: "cross", // or "isolated"
        side: sideStr, // 'buy' for long, 'sell' for short
        ordType: "limit",
        px: price,
        sz: size,
    }), secretKey));
    try {
        const response = await fetch("https://www.okx.com" + url_place_order, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'OK-ACCESS-KEY': apiKey,
                'OK-ACCESS-SIGN': sign,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': pass,
                'x-simulated-trading': demo
            },
            body: JSON.stringify({
                instId: instId,
                tdMode: "cross", // or "isolated"
                side: sideStr, // 'buy' for long, 'sell' for short
                ordType: "limit",
                px: price,
                sz: size
            })
        });
        const data = await response.json();
        output_txt(`${sideStr.charAt(0).toUpperCase() + sideStr.slice(1)} order placed: ` + JSON.stringify(data));
    } catch (error) {
        output_txt(`Error placing ${sideStr} order: ` + JSON.stringify(error));
    }
}

async function fetch_positions() {
    const url_positions = '/api/v5/account/positions';
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'GET' + url_positions, secretKey));
    try {
        const response = await fetch('https://www.okx.com' + url_positions, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'OK-ACCESS-KEY': apiKey,
                'OK-ACCESS-SIGN': sign,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': pass,
                'x-simulated-trading': demo
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching positions: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Positions:', data);
        return data;
    } catch (error) {
        console.error('Error fetching positions:', error);
        return null;
    }
}

async function fetch_orders() {
    const url_orders = '/api/v5/trade/orders-pending';
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'GET' + url_orders, secretKey));
    try {
        const response = await fetch('https://www.okx.com' + url_orders, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'OK-ACCESS-KEY': apiKey,
                'OK-ACCESS-SIGN': sign,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': pass,
                'x-simulated-trading': demo
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { code: "-1", message: error.message };
    }
}

async function check_orders(){
    OrderCheckInterval = setInterval(async function() {
        try {
            const orders = await fetch_orders();
            if (orders.code === "0") {
                if (orders.data.length === 0) {
                    stop_orders_check();
                    output_txt("Fetch orders response: No orders.");
                } else {
                    output_txt(JSON.stringify(orders.data));
                }
            } else {
                output_txt("Failed to fetch orders: " + orders.message);
            }
        } catch (error) {
            output_txt("Error during order check: " + error.message);
        }
    }, ORDERS_CHECK_INTERVAL);
}

function stop_orders_check() {
    clearInterval(OrderCheckInterval);
}

function display_positions(data) {
    if (data.length == 0){
        document.getElementById("positions").innerHTML = 'no positions';
        return;
    }
    let pos_html = "";
    document.getElementById("positions").innerHTML = "";
        for(let i = 0; i < data.length; i++){
            const upl = Number(data[i].upl);
            const notionalUsd = Number(data[i].notionalUsd);
            const currentPrice = Number(data[i].last);
            const entryPrice = Number(data[i].avgPx);
            const position = Number(data[i].pos);
            const postype = Number(data[i].pos) > 0 ? "long" : "short"
            let upnl;
            if(postype == "short")
                upnl = ((entryPrice - currentPrice) / entryPrice) * 100;
            else if(postype == "long")
                upnl = ((currentPrice - entryPrice) / entryPrice) * 100;
            if(i > 0) pos_html += "<br>";
            pos_html += data[i].instId;
            pos_html += " " + data[i].mgnMode;
            pos_html += " x" + data[i].lever;
            pos_html += " " + postype;
            pos_html += " " + entryPrice.toFixed(precision);
            pos_html += "<br>";
            pos_html += " " + (position * entryPrice).toFixed(1)+"$";
            pos_html += " PL: " + upl.toFixed(2);
            pos_html += " (" + upnl.toFixed(2) + "%)";
            pos_html += " fee: " + Number(data[i].fee).toFixed(precision);
            document.getElementById("positions").innerHTML += pos_html;
            pos_html = "";
        }
}
