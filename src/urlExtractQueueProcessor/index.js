const Runner = require('../common/classes/runner');
const Dom = require('../common/classes/dom');
const Worker = require('../common/classes/worker');
const PageUpdater = require('../common/classes/pageUpdater');

const urlTools = require('../common/utilities/urlTools');

const {
    WORKER_PAGE,
    WORKER_HOSTNAME,
    WORKER_URL_EXTRACT
} = require('../common/constants/redis');

class UrlPubSubProcessor extends Runner {

    setup () {
        this.pageUpdater = new PageUpdater()
        this.urlExtractWorker = new Worker( WORKER_URL_EXTRACT );
        this.hostnameWorker = new Worker( WORKER_HOSTNAME );
        this.pageWorker = new Worker( WORKER_PAGE );
    }

    run () {
        const { urlExtractWorker } = this;
        urlExtractWorker.receiveData( async ({ data }) => {
            const {
                html,
                hostname
            } = data;
            const dom = new Dom( html );
            const body = dom.getBody();
            const links = dom.queryLinks( body );
            for ( const { link } of links) {
                if ( !this.canProcessLink( link ) ) continue;

                const url = this.prepareLink( hostname, link );
                if ( !this.canProcessUrl( url ) ) continue;

                const urlData = new URL( url );
                const { hostname: urlHostname } = urlData;
                if ( urlHostname && urlHostname === hostname ) {
                    await this.publishPageQueue( urlData );
                } else {
                    await this.publishHostnameQueue( urlData )
                }
            }
        });
    }

    prepareLink( hostname, link ) {
        let url = link;

        if ( link.startsWith('/') ) {
            url = urlTools.buildUrl( hostname, link );
        }

        return url;
    }

    canProcessLink ( link ) {
        return  !!link
                && link.trim() !== '#'
                && link.trim() !== '';
    }

    canProcessUrl ( url ) {
        return url.startsWith('http');
    }

    async publishPageQueue ({ hostname, pathname, search }) {
        const { pageWorker, pageUpdater } = this;
        if ( await pageUpdater.canQueuePage( hostname, pathname, search ) ) {
            await pageWorker.sendData( { hostname, pathname, search });
            await pageUpdater.pageUpdated( hostname, pathname, search );
        }
    }

    async publishHostnameQueue ({ hostname }) {
        // TODO: Enable once the limit works
        return; // disabled;
        await this.hostnameWorker.sendData({ hostname });
    }

}

(new UrlPubSubProcessor()).start();