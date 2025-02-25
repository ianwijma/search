const Runner = require('../common/classes/runner');
const Worker = require('../common/classes/worker');
const PageUpdater = require('../common/classes/pageUpdater');

const SiteMetaData = require('../common/models/siteMetaData');

const {
    WORKER_PROCESSED_SITES,
    WORKER_META_COLLECT
} = require('../common/constants/redis');

class MetaQueueProcessor extends Runner {

    setup() {
        this.ensureDatabaseConnection();
        this.pageUpdater = new PageUpdater();
        this.metaCollectWorker = new Worker( WORKER_META_COLLECT );
        this.processedSiteWorker = new Worker( WORKER_PROCESSED_SITES );
    }

    run() {
        const {metaCollectWorker, pageUpdater, processedSiteWorker} = this;
        metaCollectWorker.receiveData(async ({data}) => {
            const {  hostname, pathname = '',  search = '',  meta = {}, }  = data;
            await SiteMetaData.create({ hostname, pathname, search, meta, });

            const count = await pageUpdater.decreaseHostnameCounter( hostname );
            if (count <= 0) {

                await Promise.all([
                    processedSiteWorker.sendData({ hostname }),
                    pageUpdater.resetHostnameTotal( hostname ),
                ]);
            }
        });
    }

}

(new MetaQueueProcessor()).start();