const Runner = require('../common/classes/runner');
const workerTools = require('../common/utilities/workerTools');
const redisTools = require('../common/utilities/redisTools');
const Redis = require('../common/classes/redis');
const { QUEUE_HOSTNAME, QUEUE_PAGE } = require('../common/constants/redis');

class HostnameQueueProcessor extends Runner {

    setup () {
        this.redis = new Redis();
        this.hostnameWorker = workerTools.getWorker( QUEUE_HOSTNAME, {
            redis: this.redis.getClient()
        });
        this.pageWorker = workerTools.getWorker( QUEUE_PAGE, {
            redis: this.redis.getClient()
        });
    }

    run () {
        const { hostnameWorker, redis, pageWorker } = this;
        workerTools.receiveData( hostnameWorker, async ({ data: hostname }) => {
            if ( await redisTools.canQueuePage( redis, hostname ) ) {
                await workerTools.sendData( pageWorker, { hostname } );
                await redisTools.pageUpdated( redis, hostname );
            }
        });
    }

}

(new HostnameQueueProcessor()).start();