const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const workerTools = require('../common/utilities/workerTools');
const database = require('../common/utilities/database');
const SiteMetaData = require('../common/models/siteMetaData');
const { PREFIX_PAGE_COUNTER, QUEUE_PROCESSED_SITES, QUEUE_META } = require('../common/constants/redis');


class MetaQueueProcessor extends Runner {

    setup () {
        database.ensureConnection();
        this.redis = new Redis();
        this.metaWorker = workerTools.getWorker( QUEUE_META, {
            redis: this.redis.getClient()
        });
        this.processedSiteWorker = workerTools.getWorker( QUEUE_PROCESSED_SITES, {
            redis: this.redis.getClient()
        });
    }

    run () {
        const { metaWorker, redis, processedSiteWorker } = this;
        workerTools.receiveData( metaWorker, async ({
            hostname,
            pathname = '',
            search = '',
            meta = {},
        }) => {
            const counterKey = workerTools.createKey( PREFIX_PAGE_COUNTER, hostname );
            await SiteMetaData.create({
                hostname,
                pathname,
                search,
                meta,
            });
            const count = await redis.decr( counterKey );
            if ( count <= 0 ){
                workerTools.sendData( processedSiteWorker, hostname );
            }
        });
    }

}

(new MetaQueueProcessor()).start();