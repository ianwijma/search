const AbstractRunner = require('../common/AbstractRunner');
const { QUEUE_DOWNLOAD_HTML, QUEUE_EXTRACT_URLS } = require('../common/constants/redis');
const { JSDOM } = require('jsdom');

class DownloadHtml extends AbstractRunner {

    async setup() {
        this.worker = this.getNewWorker( QUEUE_EXTRACT_URLS );
        this.htmlWorker = this.getNewWorker( QUEUE_DOWNLOAD_HTML );
    }

    async run () {
        const { worker, htmlWorker } = this;
        this.receiveWorkerMessage( worker, async ({ html, url: htmlUrlString }) => {
            console.log(`[${QUEUE_EXTRACT_URLS}]`, htmlUrlString);
            const htmlUrl = new URL( htmlUrlString );
            const dom = new JSDOM( html );
            const aTags = dom.window.document.querySelectorAll('a[href]');
            aTags.forEach(({ href: hrefString }) => {
                if ( !!hrefString || hrefString !== '#' || hrefString !== '' ) {
                    if (hrefString.startsWith('/')) {
                        hrefString = `${htmlUrl.protocol}//${htmlUrl.hostname}${hrefString}`;
                    }

                    const href = new URL( hrefString );
                    if ( href.hostname === htmlUrl.hostname ) {
                        this.sendWorkerMessage( htmlWorker, { url: hrefString } );
                    }
                }
            });
        });
    }

}


(new DownloadHtml()).start();