const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const Dom = require('../common/classes/dom');
const Text = require('../common/classes/text');
const { QUEUE_META_COLLECT, QUEUE_META_EXTRACT } = require('../common/constants/redis');
const workerTools = require('../common/utilities/workerTools');

class MetaPubSubProcessor extends Runner {

    setup () {
        const redis = new Redis();
        this.metaExtractWorker = workerTools.getWorker( QUEUE_META_EXTRACT, {
            redis: redis.getClient()
        });
        this.metaCollectWorker = workerTools.getWorker( QUEUE_META_COLLECT, {
            redis: redis.getClient()
        });
    }

    run () {
        const { metaExtractWorker, metaCollectWorker } = this;
        workerTools.receiveData(metaExtractWorker, async ({ data }) => {
            const {
                html,
                hostname,
                pathname = '',
                search = ''
            } = data;
            const meta = await this.getExtractedMeta( html );
            await workerTools.sendData( metaCollectWorker, {
                meta, hostname, pathname, search
            });
        });
    }

    async getExtractedMeta ( html ) {
        const dom = new Dom( html );

        const meta = {};

        const head = dom.getHead();
        const body = dom.getBody();

        const keywords = dom.queryAttribute( head, 'meta[name=keywords]', 'content' ) || '';
        meta['keywords'] = keywords.split(',').filter(s => !!s).map(s => s.trim());

        meta['title'] = dom.queryText( head, 'title' ) || '';
        meta['description'] = dom.queryAttribute( head, 'meta[name=description]', 'content' ) || '';
        meta['h1'] = dom.queryAllText( body, 'h1' ) || [];
        meta['h2'] = dom.queryAllText( body, 'h2' ) || [];
        meta['h3'] = dom.queryAllText( body, 'h3' ) || [];
        meta['h4'] = dom.queryAllText( body, 'h4' ) || [];
        meta['h5'] = dom.queryAllText( body, 'h5' ) || [];
        meta['h6'] = dom.queryAllText( body, 'h6' ) || [];
        meta['h6'] = dom.queryAllText( body, 'h6' ) || [];
        meta['links'] = dom.queryLinks( body ) || [];
        meta['images'] = dom.queryImages( body ) || [];

        const textObject = new Text( body.textContent );

        const [
            keyword, keyPhrases, summary
        ] = await Promise.all([
            textObject.getKeyWords( 50 ),
            textObject.getKeyPhrases( 25 ),
            textObject.getSummary( 1 ),
        ]);
        meta['content_keywords'] = keyword || [];
        meta['content_keyphrases'] = keyPhrases || [];
        meta['content_summary'] = summary || '';

        return meta;
    }

}

(new MetaPubSubProcessor()).start();