const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config()
const username = process.env.USER;
const password = process.env.PASSWORD;
var browser = false;
var page = false;

//init
async function init(callback) {
    browser = await puppeteer.launch({headless: false, devtools: false }); // default is true
    page = await browser.newPage();
    cookies = readCookies();

    if(!cookies) {
        await login();
    } else {
        console.log('skip login ...');
        await page.setCookie(...cookies);
        await callback(page,browser);
    }
}

//login
async function login() {

    page.once('load', async () => {
        await page.waitForResponse('https://c-api-bit.shopeemobile.com/id/tr');
        console.log('Page loaded!');

        var loginBtn = await page.$$('.navbar__link-text--medium');

        await loginBtn[1].click();
        await page.waitFor(1000);
        await loginBtn[1].click();
        console.log('Login Btn Clicked');

        inputLogin(page);
    });

    await page.goto('https://shopee.co.id');
}

async function inputLogin(page) {
    await page.waitFor(2000);

    var form = await page.$$('input');
    var usernameForm = form[1];
    var passwordForm = form[2];

    await usernameForm.click();
    await page.keyboard.type(username);

    await passwordForm.click();
    await page.keyboard.type(password);
    await page.keyboard.press('Enter');

    await page.waitFor(3000);
    var cookies = await page.cookies();
    saveCookies(cookies);
    console.log('Cookies Saved!');

    await browser.close();
}

function saveCookies(cookies) {
    fs.writeFileSync('cookies.json', JSON.stringify(cookies));
}

function readCookies() {
   if(!fs.existsSync('cookies.json')) {
        return false;
   }

   var cookies = fs.readFileSync('cookies.json');
   if(cookies == null || cookies || undefined) {
       cookies = JSON.parse(cookies);
   }

   return cookies.length > 0 ? cookies : false;
}

module.exports = init