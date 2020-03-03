const fs = require('fs');
var shopee = require('./shopee.js');

const target = 'https://shopee.co.id/shop/164971714/followers/';
var s = 600;
var n = 500;

shopee(async function(page,browser) {
    console.log('get followers ...');
    await page.goto(target+`?offset=${s}&limit=${n}&__classic__=1`);

    const list = await page.$$eval('.btn-follow', options => options.map(option => option.textContent.trim()[0] == '+' ? option.getAttribute('shopid') : false ));
    // const list = await page.$$eval('.btn-follow', options => options.map(option => {
    //     if(option.textContent.trim()[0] == '+') {
    //         console.log(option);
    //         option.click();
    //     }
    // }));

    fs.writeFileSync('followers.json', JSON.stringify(list));
    console.log('followers saved');

    await browser.close();    
});