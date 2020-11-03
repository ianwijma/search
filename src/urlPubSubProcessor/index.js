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
        const redis = new Redis();
        this.hostnameWorker = workerTools.getWorker( QUEUE_HOSTNAME, { redis });
        this.pageWorker = workerTools.getWorker( QUEUE_PAGE, { redis });
    }

    run () {
        const { redis } = this;
        const client = redis.getClient();
        redisTools.subscribeData(
            client,
            PUBSUB_HTML,
            async ({ data }) => {
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

                        const linkUrl = new URL( link );
                        const { hostname: linkHostname } = linkUrl;
                        !!linkHostname && linkHostname === hostname
                            ? this.publishPageQueue( linkUrl )
                            : this.publishHostnameQueue( linkUrl );
                    }
                });
            }
        );
    }

    canProcessHref ( hrefString ) {
        return  !!hrefString
                && hrefString.trim() !== '#'
                && hrefString.trim() !== '';
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