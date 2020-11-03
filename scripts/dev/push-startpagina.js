const Redis = require('../../src/common/classes/redis');
const workerTools = require('../../src/common/utilities/workerTools');
const { QUEUE_HOSTNAME } = require('../../src/common/constants/redis');

(async function (){
    const worker = workerTools.getWorker( QUEUE_HOSTNAME );
    await workerTools.sendData( worker, 'www.startpagina.nl');
    console.log('Done!');
})()

