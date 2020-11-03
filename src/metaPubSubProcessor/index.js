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
        this.metaWorker = workerTools.getWorker( QUEUE_META, {
            redis: this.redis.getClient()
        });
    }

    run () {
        const { redis, metaWorker } = this;
        const client = redis.getClient();
        redisTools.subscribeData(
            client,
            PUBSUB_HTML,
            async ({
               html,
               hostname,
               pathname = '',
               search = ''
            }) => {
                const meta = await this.getExtractMeta( html );
                workerTools.sendData( metaWorker, {
                    meta, hostname, pathname, search
                });
            }
        )
    }

    async getExtractMeta ( html ) {
        const dom = new Dom( html );

        const meta = {};

        const head = dom.getHead();
        const body = dom.getBody();

        const title = dom.queryInnerText( head, 'title' );
        meta['title'] = title;

        const keywords = dom.queryAttribute( head, 'meta[name=keywords]', 'content' ) || '';
        meta['keywords'] = keywords.split(',').filter(s => !!s).map(s => s.trim());

        meta['description'] = dom.queryAttribute( head, 'meta[name=description]', 'content' );
        meta['h1'] = dom.queryAllInnerText( body, 'h1' );
        meta['h2'] = dom.queryAllInnerText( body, 'h2' );
        meta['h3'] = dom.queryAllInnerText( body, 'h3' );
        meta['h4'] = dom.queryAllInnerText( body, 'h4' );
        meta['h5'] = dom.queryAllInnerText( body, 'h5' );
        meta['h6'] = dom.queryAllInnerText( body, 'h6' );
        meta['h6'] = dom.queryAllInnerText( body, 'h6' );
        meta['links'] = dom.queryLinks( body );
        meta['images'] = dom.queryImages( body );

        const text = new Text( body.innerText );
        const [
            keyword, keyPhrases, summary
        ] = Promise.all([
            text.getKeyWords( 100 ),
            text.getKeyPhrases( 100 ),
            text.getSummary( title ),
        ]);
        meta['content_key_words'] = keyword;
        meta['content_key_phrases'] = keyPhrases;
        meta['content_summary'] = summary;

        return meta;
    }



}