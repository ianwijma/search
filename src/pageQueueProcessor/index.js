const Runner = require('../common/classes/runner');
const urlTools = require('../common/utilities/urlTools');
const { WORKER_PAGE, WORKER_META_EXTRACT, WORKER_URL_EXTRACT } = require('../common/constants/redis');
const puppeteer = require('puppeteer');

const Worker = require('../common/classes/worker');

class PageQueueProcessor extends Runner {

    async setup () {
        this.browser = await puppeteer.launch();

        this.pageWorker = new Worker( WORKER_PAGE );
        this.metaExtractWorker = new Worker( WORKER_META_EXTRACT );
        this.urlExtractWorker = new Worker( WORKER_URL_EXTRACT );

        await this.metaExtractWorker.updateSettings( { maxsize: -1 } );
        await this.urlExtractWorker.updateSettings( { maxsize: -1 } );
    }

    run () {
        const { pageWorker } = this;
        pageWorker.receiveData( async ({ data }) => {
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
            metaExtractWorker.sendData( data ),
            urlExtractWorker.sendData( data ),
        ]);
    }

}

(new PageQueueProcessor()).start();