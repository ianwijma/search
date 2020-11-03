const Runner = require('../common/classes/runner');
const workerTools = require('../common/utilities/workerTools');
const Redis = require('../common/classes/redis');
const { QUEUE_HOSTNAME, QUEUE_PAGE, PREFIX_PAGE_COUNTER, PREFIX_PAGE_UPDATED } = require('../common/constants/redis');
const { UPDATE_DIFFERENCE_MS } = require('../common/constants/misc');

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
            const updateKey = workerTools.createKey( PREFIX_PAGE_UPDATED, hostname );
            const counterKey = workerTools.createKey( PREFIX_PAGE_COUNTER, hostname );
            if ( await this.shouldProcess( updateKey ) ) {
                await workerTools.sendData( pageWorker, { hostname } );
                redis.set( updateKey, Date.now() );
                redis.incr( counterKey );
            }
        });
    }

    async shouldProcess ( key ) {
        const updatedString = await this.redis.get( key );
        if ( !updatedString ) return true;

        const updatedAt = updatedString ? new Date(updatedString) : Date.now();
        const now = Date.now();
        return ( now - updatedAt ) > UPDATE_DIFFERENCE_MS;
    }

}

(new HostnameQueueProcessor()).start();