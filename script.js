"use strict";
const puppeteer = require("puppeteer");
const http = require("http");
const { Console } = require("console");
const player = require('play-sound');
const URL = 'https://www.walmart.ca/en/ip/playstation5-console-marvels-spider-man-miles-morales-launch-edition-bundle-plus-extra-dualsense-wireless-controller/6000202282463'
var start = Date.now();

const server = http
  .createServer((req, res) => {
    const ip = res.socket.remoteAddress;
    const port = res.socket.remotePort;
    res.end(`Your IP address is ${ip} and your source port is ${port}.`);
  })
  .listen(process.env.PORT, "0.0.0.0", function () { });

(async () => {
    const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", '--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required' ],
    ignoreDefaultArgs: "--mute-audio"   
  });
    const page = await browser.newPage();
    const session = await page.target().createCDPSession();
    await session.send('Page.enable');
    await session.send('Page.setWebLifecycleState', {state: 'active'});
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto(URL);
    await page.waitForTimeout(1000);
    var result = (await page.waitFor(() => 
        document.querySelector("button[data-automation='cta-button']").textContent
    ));
    result = result._remoteObject.value.toLowerCase();
    var counter  = 0;
    while (!result.includes("order") && !result.includes("cart")) {
      await page.waitForTimeout(100000)  
      await page.goto(URL);
        result = (await page.waitForFunction(() => 
        document.querySelector("button[data-automation='cta-button']").textContent
    ));
       // counter++;
        result = result._remoteObject.value.toLowerCase();
       // if(counter > 20) {
         // counter = 0;
        //}
        start = Date.now();
        console.log(start);
    }
await page.goto("https://timer.onlineclock.net/alarm.html");
//new Sound('audio.mp3').play();
})();