function d_str(d = new Date()){
    hh = d.getHours();
    mm = d.getMinutes();
    ss = d.getSeconds();
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    return hh + ":" + mm + ":" + ss;
}

function timestampToStr(time_ms){
    var ts = new Date(parseInt(time_ms));
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = ts.getFullYear();
    var month = months[ts.getMonth()];
    var date = ts.getDate() < 10 ? '0' + ts.getDate() : ts.getDate();
    var hour = ts.getHours() < 10 ? '0' + ts.getHours() : ts.getHours();
    var min = ts.getMinutes() < 10 ? '0' + ts.getMinutes() : ts.getMinutes();
    var sec = ts.getSeconds() < 10 ? '0' + ts.getSeconds() : ts.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

function output_txt(text){
    document.getElementById("output")
                .innerHTML += d_str() + " " + text + "</br>";
    window.scrollTo(0, document.body.scrollHeight);
    console.log(d_str() + " " + text);
}

// Function to test if string is JSON
function _JSON(text) {
    if(typeof text !== "string"){
        return "_JSON call: wrong type";
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}
