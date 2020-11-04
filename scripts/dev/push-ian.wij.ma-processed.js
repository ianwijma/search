const workerTools = require('../../src/common/utilities/workerTools');
const { QUEUE_PROCESSED_SITES } = require('../../src/common/constants/redis');

(async function (){
    const worker = workerTools.getWorker( QUEUE_PROCESSED_SITES );
    await workerTools.sendData( worker, 'ian.wij.ma');
    console.log('Done!');
})()
