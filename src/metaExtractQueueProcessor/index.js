const Runner = require('../common/classes/runner');
const Worker = require('../common/classes/worker');
const Dom = require('../common/classes/dom');
const Text = require('../common/classes/text');

const {
    WORKER_META_COLLECT,
    WORKER_META_EXTRACT
} = require('../common/constants/redis');

class MetaPubSubProcessor extends Runner {

    async setup () {
        this.metaExtractWorker = new Worker( WORKER_META_EXTRACT );
        this.metaCollectWorker = new Worker( WORKER_META_COLLECT );

        await this.metaCollectWorker.updateSettings({ maxsize: -1 })
    }

    run () {
        const { metaExtractWorker, metaCollectWorker } = this;
        metaExtractWorker.receiveData( async ({ data }) => {
            const {
                html,
                hostname,
                pathname = '',
                search = ''
            } = data;
            const meta = await this.getExtractedMeta( html );
            await metaCollectWorker.sendData( {
                meta, hostname, pathname, search
            });
        });
    }

    async getExtractedMeta ( html ) {
        const dom = new Dom( html );

        const meta = {};

        const head = dom.getHead();
        const body = dom.getBody();
        // clean the body from script tags.
        body.querySelectorAll('script').forEach(el => el.remove());

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