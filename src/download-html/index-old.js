const Browser = require('../common/utility/Browser');
const MessageQueue = require('../common/utility/MessageQueue');
const { CHANNEL_SITE, CHANNEL_URL, CHANNEL_META } = require('../common/constants/redis');
const { JSDOM } = require('jsdom');

(async function (){
    const browser = new Browser();

    const messageQueue = new MessageQueue();

    await messageQueue.subscribe( CHANNEL_SITE, async ( data ) => {
        const { message: urlString } = data;
        const url = new URL( urlString );
        const html = await browser.getPageHtml( urlString );
        const dom = new JSDOM( html );

        const aTags = dom.window.document.querySelectorAll('a[href]');
        aTags.forEach(({ href: linkString }) => {
            if ( linkString ) {
                if (linkString.startsWith('/')) {
                    linkString = `${url.protocol}//${url.hostname}${linkString}`;
                }

                messageQueue.publish( CHANNEL_SITE, linkString );
            }
        });
    })

})()