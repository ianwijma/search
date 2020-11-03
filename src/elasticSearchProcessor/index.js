const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const workerTools = require('../common/utilities/workerTools');
const { QUEUE_PROCESSED_SITES } = require('../common/constants/redis');
const SiteMetaData = require('../common/models/siteMetaData');

class ElasticSearchProcessor extends Runner {

    setup () {
        this.redis = new Redis();
        this.processedSiteWorker = workerTools.getWorker( QUEUE_PROCESSED_SITES, {
            redis: this.redis.getClient()
        });
    }

    run () {
        const { processedSiteWorker } = this;
        workerTools.receiveData( processedSiteWorker, async ({ data: hostname }) => {
            const cursor = await SiteMetaData.find({ hostname }).cursor();
            for ( let model = await cursor.next(); model != null; model = await cursor.next() ) {
                const {
                    hostname,
                    pathname = '',
                    search = '',
                    meta = {}
                } = model;
                const {
                    title = '',
                    keywords = [],
                    description = '',
                    h1 = [],
                    h2 = [],
                    h3 = [],
                    h4 = [],
                    h5 = [],
                    h6 = [],
                    links = [],
                    images = [],
                    content_key_words = [],
                    content_key_phrases = [],
                    content_summary = '',
                } = meta;


                // TODO push to elasticSearch
            }
        });
    }

}

(new ElasticSearchProcessor()).start();