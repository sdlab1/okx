async function OHLCV(symbol, bar, after, limit = 100){
// GET / Candlesticks history
// Rate Limit: 20 requests per 2 seconds
    function cleanjson(data){
        const volume = parseFloat(data[7]).toFixed(2);
        return [
        parseInt(data[0]), //Math.floor(parseInt(data[0]) / 1000),
        data[1],
        data[2],
        data[3],
        data[4],
        volume //data[7]
        ];
    }
    //const after = new Date().getTime() - 4 * 24 * 3600 * 1000;
    let after_str = "";
    if(after)
        after_str = `&after=${after}`;
    const history_ohlcv_url = "/api/v5/market/history-candles?instId="+`${symbol}&bar=${bar}&limit=${limit}${after_str}`;
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp +'GET'+ history_ohlcv_url, secretKey));
    const headers = {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': pass,
      'x-simulated-trading': demo
    };
    try {
      const response = await fetch("https://www.okx.com" + history_ohlcv_url, { headers });
      if (!response.ok) {
        throw new Error(`Error fetching ohlcv data: ${response.statusText}`);
      }
      //const response_JSON = await JSON.parse(response);
      const response_JSON = await response.json();
      console.log('Historical OHLCV data:', response_JSON);
      console.log(timestampToStr(response_JSON.data[0][0]));
      console.log(timestampToStr(response_JSON.data[response_JSON.data.length-1][0])); 
      // CUT ALL excessive DATA
      for(let i = 0; i < response_JSON.data.length; i++)
        response_JSON.data[i] = cleanjson(response_JSON.data[i]);
    /*test_str = JSON.stringify(response_JSON.data[0]);
    console.log(test_str + "; Size " + new TextEncoder().encode(test_str).length + " bytes");*/
    } catch (error) {
        output_txt(`OHLCV failed, retry in ${OHLCV_retry_delay / 1000} seconds...`);
        /*    
        console.error('Error fetching historical OHLCV data:', error);
        console.log(`Retrying in ${OHLCV_retry_delay / 1000} seconds...`);
        */
        //setTimeout(() => fetchHistoricalOHLCV(symbol, bar), OHLCV_retry_delay);
    }
  }