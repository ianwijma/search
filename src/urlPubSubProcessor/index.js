const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const Dom = require('../common/classes/dom');
const { PUBSUB_HTML, QUEUE_PAGE, QUEUE_HOSTNAME } = require('../common/constants/redis');
const workerTools = require('../common/utilities/workerTools');
const redisTools = require('../common/utilities/redisTools');
const urlTools = require('../common/utilities/urlTools');

class UrlPubSubProcessor extends Runner {

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
        const { redis } = this;
        const client = redis.getClient();
        redisTools.subscribeData(
            client,
            PUBSUB_HTML,
            async ({
               html,
               hostname
            }) => {
                const dom = new Dom( html );
                const body = dom.getBody();
                const links = dom.queryLinks( body );
                links.forEach(({ link }) => {
                    if ( this.canProcessHref( link ) ) {
                        if ( link.startsWith('/') ) {
                            link = urlTools.buildUrl( hostname, link );
                        }

                        const linkUrl = new URL( link );
                        linkUrl.hostname === hostname
                            ? this.publishPageQueue( linkUrl )
                            : this.publishHostnameQueue( linkUrl );
                    }
                });
            }
        );
    }

    canProcessHref ( hrefString ) {
        return  !!hrefString
                || hrefString !== '#'
                || hrefString !== '';
    }

    publishPageQueue ({ hostname, pathname, search }) {
        workerTools.sendData( this.pageWorker, {
            hostname, pathname, search
        });
    }

    publishHostnameQueue ({ hostname }) {
        workerTools.sendData( this.hostnameWorker, hostname);
    }

}

(new UrlPubSubProcessor()).start();