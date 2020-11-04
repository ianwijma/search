const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const Dom = require('../common/classes/dom');
const { QUEUE_PAGE, QUEUE_HOSTNAME, QUEUE_URL_EXTRACT } = require('../common/constants/redis');
const workerTools = require('../common/utilities/workerTools');
const redisTools = require('../common/utilities/redisTools');
const urlTools = require('../common/utilities/urlTools');

class UrlPubSubProcessor extends Runner {

    setup () {
        this.redis = new Redis();
        this.urlExtractWorker = workerTools.getWorker( QUEUE_URL_EXTRACT, {
            redis: this.redis.getClient()
        });
        this.hostnameWorker = workerTools.getWorker( QUEUE_HOSTNAME, {
            redis: this.redis.getClient()
        });
        this.pageWorker = workerTools.getWorker( QUEUE_PAGE, {
            redis: this.redis.getClient()
        });
    }

    run () {
        const { urlExtractWorker } = this;
        workerTools.receiveData(urlExtractWorker, async ({ data }) => {
            const {
                html,
                hostname
            } = data;
            const dom = new Dom( html );
            const body = dom.getBody();
            const links = dom.queryLinks( body );
            links.forEach(({ link }) => {
                if ( this.canProcessHref( link ) ) {
                    if ( link.startsWith('/') ) {
                        link = urlTools.buildUrl( hostname, link );
                    }

                    if ( link.startsWith('http') ) {
                        const linkUrl = new URL( link );
                        const { hostname: linkHostname } = linkUrl;
                        !!linkHostname && linkHostname === hostname
                            ? this.publishPageQueue( linkUrl )
                            : this.publishHostnameQueue( linkUrl );
                    }
                }
            });
        });
    }

    canProcessHref ( hrefString ) {
        return  !!hrefString
                && hrefString.trim() !== '#'
                && hrefString.trim() !== '';
    }

    async publishPageQueue ({ hostname, pathname, search }) {
        const { pageWorker, redis } = this;
        if ( await redisTools.canQueuePage( redis, hostname, pathname, search ) ) {
            await workerTools.sendData( pageWorker, { hostname, pathname, search });
            await redisTools.pageUpdated( redis, hostname, pathname, search );
        }
    }

    async publishHostnameQueue ({ hostname }) {
        return; // disabled;
        await workerTools.sendData( this.hostnameWorker, hostname);
    }

}

(new UrlPubSubProcessor()).start();