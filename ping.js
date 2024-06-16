function startPing(){
    pingInterval = setInterval(function() {
        if(ws.readyState === WebSocket.OPEN){
            if(verbose)
                console.log(d_str() + ' Sending ping');
            ping_counter++;
            ws.send('ping');
        }
        setTimeout(() => {
            if(Date.now() - last_pong > offline){
                if (ws.readyState === WebSocket.OPEN){ 
                    ws.close();
                }
            }
            if(Date.now() - last_book > offline){
                ws_pub.close();
            }
        }, PONG_CHECK_DELAY);
    }, PING_INTERVAL);
}

function stopPing(){
    clearInterval(pingInterval);
}

function calcPingPong(){
    const PingPongRatio = ( (pong_counter / ((new Date().getTime() - start) / PING_INTERVAL))*100 );
    if(PingPongRatio > 0.94)
        return  PingPongRatio.toFixed(1)+"%";
    else
        return  PingPongRatio.toFixed()+"%";
    return "";
}