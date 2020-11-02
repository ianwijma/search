const AbstractRunner = require('../../src/common/AbstractRunner.js');
const RSMQWorker = require('rsmq-worker');
const { QUEUE_DOWNLOAD_HTML } = require('../../src/common/constants/redis');

(async function (){
    const worker = new RSMQWorker( QUEUE_DOWNLOAD_HTML, {
        autostart: true,
    });

    (new AbstractRunner()).sendWorkerMessage(worker, {
        url: 'https://www.startpagina.nl/'
    });

    console.log('Done!');
})()

