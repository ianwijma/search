const AbstractRunner = require('../common/AbstractRunner');
const { QUEUE_EXTRACT_META, QUEUE_IMPORT_META } = require('../common/constants/redis');
const { JSDOM } = require('jsdom');

class DownloadHtml extends AbstractRunner {

    async setup() {
        this.worker = this.getNewWorker( QUEUE_EXTRACT_META );
        this.metaImportWorker = this.getNewWorker( QUEUE_IMPORT_META );
    }

    async run () {
        const { worker, metaImportWorker } = this;
        this.receiveWorkerMessage( worker, async ({ html, url }) => {
            const dom = new JSDOM( html );
            const { head, body } = dom.window;
            this.sendWorkerMessage( metaImportWorker, {
                url,
                title: head.querySelectorAll('title').innerText,
                description: head.querySelectorAll('meta[name=description]').content,
                keywords: head.querySelectorAll('meta[name=keywords]').content,
                bodyText: body.innerText
            });
        });
    }

}


(new DownloadHtml()).start();