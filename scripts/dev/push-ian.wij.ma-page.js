const workerTools = require('../../src/common/utilities/workerTools');
const { QUEUE_PAGE } = require('../../src/common/constants/redis');

(async function (){
    const worker = workerTools.getWorker( QUEUE_PAGE );
    await workerTools.sendData( worker, {
        hostname: 'ian.wij.ma',
        pathname: '',
        search: '',
    });
    console.log('Done!');
})()
