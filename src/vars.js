const START_RETRY_DELAY = 5000; // 5 seconds
const start = new Date().getTime();
let ping_counter = 0;
let pong_counter = 0;
//let pairId = "UNI-USDT";
let instId = "UNI-USDT-SWAP"; // BTC-USDT-SWAP is for perpetual futures, x5
const precision = 3; //decimal digits
let ws;
let ws_pub;
let verbose = false;
let print_pong = false;
let pingInterval;
const PING_INTERVAL = 10000; // milliseconds to ping pong (less than 30000)
let OrderCheckInterval;
const ORDERS_CHECK_INTERVAL = 60000;
let last_pong;
const PONG_CHECK_DELAY = 2000;
let last_book;
const offline = 60000; // milliseconds
let reconnect_bool = true;
let reconnect_public_bool = true;
const checkConnectionDelay = 3000; // 3 seconds
const reconnect_time = 30;
const reconnect_time_public = 30;
const ask_color = '<font color="#ddd">';
const bid_color = '<font color="#ddd">';
const qtyatprice_color = '<font color="#999">';
let leverage_value;
let book_value;
const buy = 1;
const sell = 0;
const OHLCV_retry_delay = 10000; // 10 seconds
