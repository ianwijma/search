const AbstractRunner = require('../common/AbstractRunner');
const { QUEUE_EXTRACT_URLS, QUEUE_DOWNLOAD_HTML, QUEUE_EXTRACT_META } = require('../common/constants/redis');
const puppeteer = require('puppeteer');

class DownloadHtml extends AbstractRunner {

    async setup() {
        this.browser = await puppeteer.launch();
        this.worker = this.getNewWorker( QUEUE_DOWNLOAD_HTML );
        this.metaExtractWorker = this.getNewWorker( QUEUE_EXTRACT_META );
        this.extractUrlsWorker = this.getNewWorker( QUEUE_EXTRACT_URLS );
    }

    async run () {
        const { browser, worker, metaExtractWorker, extractUrlsWorker } = this;
        this.receiveWorkerMessage( worker, async ({ url }) => {
            if (!url) return;

            const page = await browser.newPage();
            await page.goto(url, {waitUntil: 'networkidle2'});
            const html = await page.evaluate(() => {
                return document.documentElement.outerHTML;
            });

            this.sendWorkerMessage( metaExtractWorker, {
                html, url
            });
            this.sendWorkerMessage( extractUrlsWorker, {
                html, url
            });
        });
    }

}


(new DownloadHtml()).start();