const MessageQueue = require('../../src/common/utility/MessageQueue');
const { CHANNEL_SITE } = require('../../src/common/constants/redis');

(async function (){
    const messageQueue = new MessageQueue();

    await messageQueue.publish( CHANNEL_SITE, {url: 'https://www.startpagina.nl/'});

    console.log('Done!');
})()

