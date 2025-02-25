const Worker = require('../../src/common/classes/worker');

const {
    WORKER_HOSTNAME
} = require('../../src/common/constants/redis');

(async function (){
    const worker = new Worker( WORKER_HOSTNAME );
    await worker.sendData({ hostname: 'ian.wij.ma' });
    console.log('Done!');
})()

