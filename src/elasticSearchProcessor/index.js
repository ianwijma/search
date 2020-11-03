const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const workerTools = require('../common/utilities/workerTools');
const urlTools = require('../common/utilities/urlTools');
const { QUEUE_PROCESSED_SITES } = require('../common/constants/redis');
const { PAGE_METADATA } = require('../common/constants/elasticSearch');
const SiteMetaData = require('../common/models/siteMetaData');
const { Client } = require('@elastic/elasticsearch');

class ElasticSearchProcessor extends Runner {

    setup () {
        this.redis = new Redis();
        this.processedSiteWorker = workerTools.getWorker( QUEUE_PROCESSED_SITES, {
            redis: this.redis.getClient()
        });
    }

    run () {
        const { processedSiteWorker, elasticSearch } = this;
        workerTools.receiveData( processedSiteWorker, async ({ data: hostname }) => {
            const cursor = await SiteMetaData.find({ hostname }).cursor();
            for ( let model = await cursor.next(); model != null; model = await cursor.next() ) {

            }
        });
    }

}

(new ElasticSearchProcessor()).start();