// https://www.okx.com/docs-v5/en/#overview-rest-authentication
//REST: Request bodies should have content type application/json and be in valid JSON format.
async function commissions() {
    const url_trade_fee = '/api/v5/account/trade-fee'+"?instType=SWAP";
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp +'GET'+ url_trade_fee, secretKey));
    //'Content-Type': 'application/json', //removed
    try {
            const response = await fetch("https://www.okx.com" + url_trade_fee, {
                method: 'GET',
                headers: {
                    'OK-ACCESS-KEY': apiKey,
                    'OK-ACCESS-SIGN': sign,
                    'OK-ACCESS-TIMESTAMP': timestamp,
                    'OK-ACCESS-PASSPHRASE': pass,
                    'x-simulated-trading': demo
                }
            });
            const data = await response.json();
            output_txt(JSON.stringify(data.data[0]));
    
        } catch (error) {
            output_txt('Error fetching commissions: ' + JSON.stringify(error));
        }
    }

async function set_leverage(instId, leverage){
    const url_set_leverage = '/api/v5/account/set-leverage';
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'POST' + url_set_leverage + JSON.stringify({
        instId: instId,
        lever: leverage,
        mgnMode: "cross" // or "isolated"
    }), secretKey));
    try {
        const response = await fetch("https://www.okx.com" + url_set_leverage, {
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
                lever: leverage,
                mgnMode: "cross" // or "isolated"
            })
        });

        const data = await response.json();
        output_txt('Leverage set: ' + JSON.stringify(data));
    } catch (error) {
        output_txt('Error setting leverage: ' + JSON.stringify(error));
    } 
}

// https://www.okx.com/docs-v5/en/#trading-account-rest-api-set-position-mode
async function set_position_mode(mode) {
    const url_set_position_mode = '/api/v5/account/set-position-mode';
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'POST' + url_set_position_mode + JSON.stringify({
        posMode: mode
    }), secretKey));

    try {
        const response = await fetch("https://www.okx.com" + url_set_position_mode, {
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
                posMode: mode    
            })
    });
        const data = await response.json();
        output_txt('Position mode set: ' + JSON.stringify(data));
        return data;
    } catch (error) {
        output_txt('Error setting position mode: ' + JSON.stringify(error));
        return null;
    }
}

// https://www.okx.com/docs-v5/en/#trading-account-rest-api-get-account-configuration
// https://www.okx.com/docs-v5/en/#trading-account-rest-api-set-account-mode
async function set_account_level(level) {
    const url_set_account_level = '/api/v5/account/set-account-level';
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'POST' + url_set_account_level + JSON.stringify(
        { acctLv: level }), secretKey));
    try {
        const response = await fetch("https://www.okx.com" + url_set_account_level, {
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
                acctLv: level
            })
        });

        const data = await response.json();
        output_txt('Account level set: ' + JSON.stringify(data));
        return data;
    } catch (error) {
        output_txt('Error setting account level: ' + JSON.stringify(error));
        return null;
    }
}
