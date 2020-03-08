const fs = require('fs');
var shopee = require('./shopee.js');
const followPath = 'https://shopee.co.id/buyer/follow/shop/';

shopee(async function(page,browser) {
    console.log('started ...');
    await page.goto(process.env.TARGET);
    await page.waitFor(3000); //wait
    console.log('Page loaded!');

    var data = readFollowers();
    var csrf = await page.cookies();    
    csrf = csrf.find( el => el.name === 'csrftoken' );
    csrf = csrf.value;
    console.log('csrf : '+csrf);

    for (v of data) {
        console.log('Follow '+v);
        var url = followPath + v;
        var param = {
            url : url,
            data : `csrfmiddlewaretoken=${csrf}`
        };

        await page.evaluate((x) => {

            fetch(x.url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                // 'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                //   redirect: 'follow', // manual, *follow, error
                //   referrerPolicy: 'no-referrer', // no-referrer, *client
                body: x.data // body data type must match "Content-Type" header
            });

        }, param);
    }

    console.log('finished !');

    // await browser.close();    
});

function readFollowers() {
    var data = fs.readFileSync('followers.json');
    if(data == null || data || undefined) {
        data = JSON.parse(data);
    }
 
    return data.length > 0 ? data : false;
}
