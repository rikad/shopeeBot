const fs = require('fs');
var shopee = require('./shopee.js');

const target = process.env.TARGET;
var s = parseInt(process.env.START);
var n = parseInt(process.env.END);

shopee(async function(page,browser) {
    console.log('get followers ...');

    var list = [];
    while (s <= n) {
        await page.goto(target+`?offset=${s}&limit=${99}&__classic__=1`);
        var newList = await page.$$eval('.btn-follow', options => options.map(option => option.textContent.trim()[0] == '+' ? option.getAttribute('shopid') : false ));
        list = list.concat(newList);

        s += 100
    }

    fs.writeFileSync('followers.json', JSON.stringify(list));
    console.log('followers saved');

    await browser.close();  
});