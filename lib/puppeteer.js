const puppeteer = require('puppeteer');
const helpers = require('./helpers');

module.exports = {

  makeScreenshot: async (url, folder, testcase) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
      width: 1440,
      height: 900
    });

    try {
      await page.goto(url, {waitUntil: 'networkidle0', timeout: 60000});
    }
    catch (error) {
      console.log(error);
      browser.close();
      return;
    }

    await page._client.send('Animation.setPlaybackRate', { playbackRate: 4.0 });
    await autoScroll(page);
    const title = helpers.prettyFileName(url);
    await page.screenshot({ path: `projects/${folder}/${testcase}/${title}.png`, fullPage: true });
    browser.close();

  },
  getUrls: async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0', timeout: 60000});
    const content = await page.evaluate(() => {
      const divs = [...document.querySelectorAll('a')];
      return divs
        .map((ele) => ele.href)
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(a => !a.includes('#'));
    });
    browser.close();
    return content.filter(a => a.includes(url));
  }

}

function autoScroll(page){
  return page.evaluate(() => {
    return new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 125);
    })
  });
}
