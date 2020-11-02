const RSMQPromise = require('rsmq-promise');
const { CHANNEL_URL } = require('../../src/common/constants/redis');

(async function (){
    const publisher = new RSMQPromise();

    publisher.sendMessage({  })
})()

