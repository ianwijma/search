const Runner = require('../common/classes/runner');
const Worker = require('../common/classes/worker');
const PageUpdater = require('../common/classes/pageUpdater');

const {
    WORKER_HOSTNAME,
    WORKER_PAGE
} = require('../common/constants/redis');

class HostnameQueueProcessor extends Runner {

    setup () {
        this.pageUpdater = new PageUpdater()
        this.hostnameWorker = new Worker( WORKER_HOSTNAME );
        this.pageWorker = new Worker( WORKER_PAGE );
    }

    run () {
        const { hostnameWorker, pageUpdater, pageWorker } = this;
        hostnameWorker.receiveData(async ({ data }) => {
            const { hostname } = data;
            if ( await pageUpdater.canQueuePage( hostname ) ) {
                await Promise.all([
                    pageUpdater.pageUpdated( hostname ),
                    pageWorker.sendData( { hostname } ),
                ]);
            }
        })
    }

}

(new HostnameQueueProcessor()).start();