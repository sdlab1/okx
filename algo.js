const stoploss = 0;
const takeprofit = 1;
async function algo_order(instId, size, side, algo_type, triggerPx, Px) {
    const url_place_order = '/api/v5/trade/order-algo';
    const timestamp = new Date().toISOString();
    const sideStr = side === buy ? "buy" : "sell"; // Determine side string for API call
    let order = {
        instId: instId,
        tdMode: 'cross', // or 'isolated' depending on your margin mode
        side: sideStr,
        ordType: 'conditional', // Conditional order type
        sz: size.toString(),   
        };
    if(algo_type == stoploss){
        order.slTriggerPx = triggerPx.toString(), // Stop Loss trigger price
        order.slOrdPx = Px.toString()          // Stop Loss order price
    }
    else if(algo_type == takeprofit){
        order.tpTriggerPx = triggerPx.toString(); // Take Profit trigger price
        order.tpOrdPx = Px.toString();         // Take Profit order price
    }
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'POST' + url_place_order + JSON.stringify(order), secretKey));
    try {
        const response = await fetch('https://www.okx.com' + url_place_order, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'OK-ACCESS-KEY': apiKey,
                'OK-ACCESS-SIGN': sign,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': pass,
                'x-simulated-trading': demo
            },
            body: JSON.stringify(order)
        });
        const data = await response.json();
        console.log('Algo order placed:', data);
        return data;
    } catch (error) {
        console.error('Error placing algo order:', error);
        return null;
    }
}

