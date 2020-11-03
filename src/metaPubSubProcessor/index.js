const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const Dom = require('../common/classes/dom');
const Text = require('../common/classes/text');
const redisTools = require('../common/utilities/redisTools');
const { QUEUE_META, PUBSUB_HTML } = require('../common/constants/redis');
const workerTools = require('../common/utilities/workerTools');

class MetaPubSubProcessor extends Runner {

    setup () {
        this.redis = new Redis();
        const redis = new Redis();
        this.metaWorker = workerTools.getWorker( QUEUE_META, { redis });
    }

    run () {
        const { redis, metaWorker } = this;
        const client = redis.getClient();
        redisTools.subscribeData(
            client,
            PUBSUB_HTML,
            async ({ data }) => {
                const {
                    html,
                    hostname,
                    pathname = '',
                    search = ''
                } = data;
                const meta = await this.getExtractedMeta( html );
                workerTools.sendData( metaWorker, {
                    meta, hostname, pathname, search
                });
            }
        )
    }

    async getExtractedMeta ( html ) {
        const dom = new Dom( html );

        const meta = {};

        const head = dom.getHead();
        const body = dom.getBody();

        const keywords = dom.queryAttribute( head, 'meta[name=keywords]', 'content' ) || '';
        meta['keywords'] = keywords.split(',').filter(s => !!s).map(s => s.trim());

        meta['title'] = dom.queryText( head, 'title' );
        meta['description'] = dom.queryAttribute( head, 'meta[name=description]', 'content' );
        meta['h1'] = dom.queryAllText( body, 'h1' );
        meta['h2'] = dom.queryAllText( body, 'h2' );
        meta['h3'] = dom.queryAllText( body, 'h3' );
        meta['h4'] = dom.queryAllText( body, 'h4' );
        meta['h5'] = dom.queryAllText( body, 'h5' );
        meta['h6'] = dom.queryAllText( body, 'h6' );
        meta['h6'] = dom.queryAllText( body, 'h6' );
        meta['links'] = dom.queryLinks( body );
        meta['images'] = dom.queryImages( body );

        const textObject = new Text( body.textContent );

        const [
            keyword, keyPhrases, summary
        ] = await Promise.all([
            textObject.getKeyWords( 100 ),
            textObject.getKeyPhrases( 100 ),
            textObject.getSummary(),
        ]);
        meta['content_key_words'] = keyword;
        meta['content_key_phrases'] = keyPhrases;
        meta['content_summary'] = summary;

        return meta;
    }

}

(new MetaPubSubProcessor()).start();