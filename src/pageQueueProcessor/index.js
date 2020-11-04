const Runner = require('../common/classes/runner');
const workerTools = require('../common/utilities/workerTools');
const urlTools = require('../common/utilities/urlTools');
const Redis = require('../common/classes/redis');
const { QUEUE_PAGE, QUEUE_META_EXTRACT, QUEUE_URL_EXTRACT } = require('../common/constants/redis');
const puppeteer = require('puppeteer');

class PageQueueProcessor extends Runner {

    async setup () {
        this.browser = await puppeteer.launch();
        this.redis = new Redis();
        this.pageWorker = workerTools.getWorker( QUEUE_PAGE, {
            redis: this.redis.getClient()
        });
        this.metaExtractWorker = workerTools.getWorker( QUEUE_META_EXTRACT, {
            redis: this.redis.getClient()
        });
        this.urlExtractWorker = workerTools.getWorker( QUEUE_URL_EXTRACT, {
            redis: this.redis.getClient()
        });

        const maxsize = -1;
        await workerTools.updateWorkerSettings( this.metaExtractWorker, { maxsize })
        await workerTools.updateWorkerSettings( this.urlExtractWorker, { maxsize })
    }

    run () {
        const { pageWorker } = this;
        workerTools.receiveData( pageWorker, async ({ data }) => {
            const { hostname, pathname = '', search = '' } = data;
            const url = urlTools.buildUrl( hostname, pathname, search );
            const html = await this.getHtml( url );
            await this.publishHTML( html, hostname, pathname, search );
        });
    }

    async getHtml ( url ) {
        const contact = await this.browser.createIncognitoBrowserContext();
        const page = await contact.newPage();
        const [ contentType ] = await Promise.all([
            this._pageGetContentType( page, url ),
            this._pageGoto( page, url ),
        ]);

        if ( contentType.indexOf('text/html') === -1 ) return ''; // Not a HTML document

        const html = await page.evaluate(() => {
            return document.documentElement.outerHTML;
        });
        await page.close();
        return html;
    }

    async _pageGetContentType (page, wantedUrl ) {
        const url = new URL( wantedUrl );
        return new Promise((resolve) => {
            page.on('response', async (response) => {
                const responseUrl = new URL( response.url() );
                if ( url.href === responseUrl.href ) {
                    const headers = response.headers();
                    resolve( headers['content-type'] );
                }
            });
        })
    }

    _pageGoto ( page, url ) {
        return new Promise(resolve => {
            page.goto( url, { waitUntil: 'networkidle2' } )
                .then(resolve)
                .catch(resolve);
        })
    }

    async publishHTML ( html, hostname, pathname = '', search = '' ) {
        const { metaExtractWorker, urlExtractWorker } = this;
        const data = { html, hostname, pathname, search };
        await Promise.all([
            workerTools.sendData( metaExtractWorker, data ),
            workerTools.sendData( urlExtractWorker, data ),
        ]);
    }

}

(new PageQueueProcessor()).start();