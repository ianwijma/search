const RSMQWorker = require('rsmq-worker');

module.exports = class AbstractRunner {

    getNewWorker( queueName ) {
        return new RSMQWorker( queueName, {
            autostart: true,
            timeout: 0,
        });
    }

    async start() {
        await this.setup();
        this.run();
    }

    encodeWorkerMessage( message ) {
        return typeof message === 'string' ?
            message :
            JSON.stringify( message );
    }

    decodeWorkerMessage( message, id ) {
        let data = { message, id };

        // Try to parse the message
        try {
            const parse = JSON.parse( message );
            data = {
                ...parse,
                id
            }
        } catch (err){}

        return data;
    }

    sendWorkerMessage ( worker, message ) {
        worker.send( this.encodeWorkerMessage( message ) );
    }

    receiveWorkerMessage ( worker, promiseCallback ) {
        worker.on('message', (message, next, id) => {
            const data = this.decodeWorkerMessage(message, id);
            promiseCallback( data )
                .then(() => next())
                .catch(error => {
                    console.error(error);
                    next();
                })
        });
    }

}