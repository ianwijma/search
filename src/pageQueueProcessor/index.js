const Runner = require('../common/classes/runner');
const workerTools = require('../common/utilities/workerTools');
const redisTools = require('../common/utilities/redisTools');
const urlTools = require('../common/utilities/urlTools');
const Redis = require('../common/classes/redis');
const { QUEUE_PAGE, PUBSUB_HTML } = require('../common/constants/redis');
const puppeteer = require('puppeteer');

class PageQueueProcessor extends Runner {

    async setup () {
        this.browser = await puppeteer.launch();
        this.redis = new Redis();
        this.pageWorker = workerTools.getWorker( QUEUE_PAGE, {
            redis: this.redis.getClient()
        });
    }

    run () {
        const { pageWorker } = this;
        workerTools.receiveData( pageWorker, async ({ data }) => {
            const { hostname, pathname = '', search = '' } = data;
            const url = urlTools.buildUrl( hostname, pathname, search );
            const html = await this.getHtml( url );
            this.publishHTML( html, hostname, pathname );
        });
    }

    async getHtml ( url ) {
        const contact = await this.browser.createIncognitoBrowserContext();
        const page = await contact.newPage();
        await page.goto( url, { waitUntil: 'networkidle2' } );
        const html = await page.evaluate(() => {
            return document.documentElement.outerHTML;
        });
        await page.close();
        return html;
    }

    publishHTML ( html, hostname, pathname ) {
        redisTools.publishData( this.redis.getClient(), PUBSUB_HTML, {
            html,
            hostname,
            pathname
        });
    }

}

(new PageQueueProcessor()).start();