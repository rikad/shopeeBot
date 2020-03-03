const fs = require('fs');

function readCookies() {
    var cookies = fs.readFileSync('cookies.json');
    if(cookies == null || cookies || undefined) {
        cookies = JSON.parse(cookies);
    }
 
    return cookies.length > 0 ? cookies : false;
}

readCookies().map( el => console.log(el.value) )
