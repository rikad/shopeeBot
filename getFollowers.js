const fs = require('fs');
var shopee = require('./shopee.js');

const target = process.env.TARGET;
var s = process.env.START;
var n = process.env.END;

shopee(async function(page,browser) {
    console.log('get followers ...');
    await page.goto(target+`?offset=${s}&limit=${n}&__classic__=1`);

    const list = await page.$$eval('.btn-follow', options => options.map(option => option.textContent.trim()[0] == '+' ? option.getAttribute('shopid') : false ));

    fs.writeFileSync('followers.json', JSON.stringify(list));
    console.log('followers saved');

    await browser.close();    
});