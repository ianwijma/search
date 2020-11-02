const AbstractRunner = require('../common/AbstractRunner');
const { QUEUE_IMPORT_META } = require('../common/constants/redis');
const { INDEX_META } = require('../common/constants/elasticSearch');
const { Client } = require('@elastic/elasticsearch');

class DownloadHtml extends AbstractRunner {

    async setup() {
        this.worker = this.getNewWorker( QUEUE_IMPORT_META );
        this.client = new Client({ node: 'http://localhost:9200' });
    }

    async run () {
        const { worker } = this;
        this.receiveWorkerMessage( worker, async ({ url: urlString, ...data }) => {
            console.log(`[${QUEUE_IMPORT_META}]`, urlString);
            const url = new URL( urlString );
            const body = {
                url: {
                    ...url
                },
                ...data
            };
            await this.client.index({
                index: INDEX_META,
                body
            })
        });
    }

}


(new DownloadHtml()).start();