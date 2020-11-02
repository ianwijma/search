const puppeteer = require('puppeteer');

module.exports = class Browser {

    async getBrowser() {
            return await puppeteer.launch();
    }

    async getPageHtml( url ) {
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle2'});
        return await page.evaluate(() => {
            return document.documentElement.outerHTML;
        });
    }

}