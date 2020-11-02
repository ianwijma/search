const Browser = require('../common/utility/Browser');
const MessageQueue = require('../common/utility/MessageQueue');
const { CHANNEL_URL, CHANNEL_HTML } = require('../common/constants/redis');

(async function (){
    const browser = new Browser();

    const messageQueue = new MessageQueue();

    await messageQueue.subscribe( CHANNEL_URL, async ( data ) => {
        const { message: url } = data;
        const html = await browser.getPageHtml( url );
        console.log(html);
    })

})()

