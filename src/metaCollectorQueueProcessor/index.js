const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const workerTools = require('../common/utilities/workerTools');
const database = require('../common/utilities/database');
const redisTools = require('../common/utilities/redisTools');
const SiteMetaData = require('../common/models/siteMetaData');
const {QUEUE_PROCESSED_SITES, QUEUE_META_COLLECT} = require('../common/constants/redis');


class MetaQueueProcessor extends Runner {

    setup() {
        database.ensureConnection();
        this.redis = new Redis();
        this.metaWorker = workerTools.getWorker(QUEUE_META_COLLECT, {
            redis: this.redis.getClient()
        });
        this.processedSiteWorker = workerTools.getWorker(QUEUE_PROCESSED_SITES, {
            redis: this.redis.getClient()
        });
    }

    run() {
        const {metaWorker, redis, processedSiteWorker} = this;
        workerTools.receiveData(metaWorker, async ({data}) => {
            const {  hostname, pathname = '',  search = '',  meta = {}, }  = data;
            await SiteMetaData.create({ hostname, pathname, search, meta, });
            const count = await redisTools.decreaseHostnamePageCounter(redis, hostname);
            if (count <= 0) {
                await workerTools.sendData(processedSiteWorker, hostname);
            }
        });
    }

}

(new MetaQueueProcessor()).start();