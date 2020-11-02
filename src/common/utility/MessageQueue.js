const RSMQPromise = require('rsmq-promise');
const RSMQWorker = require('rsmq-worker');

module.exports = class MessageQueue {

    async subscribe ( queueName, promiseCallback ) {
        await this.ensureQueue( queueName );

        const worker = new RSMQWorker( queueName, {
            autostart: true
        });

        worker.on('message', async ( message, next, id ) => {
            const data = this.decodeMessage( message, id );
            promiseCallback( data )
                .then(() => next())
                .catch(err => {
                    console.error( err );
                    next();
                });
        });
    }

    decodeMessage(message, id ) {
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

    encodeMessage( message ) {
        return typeof message === 'string' ?
            message :
            JSON.stringify( message );
    }

    getPublisher () {
        return new RSMQPromise();
    }

    async ensureQueue ( queueName ) {
        const pub = this.getPublisher();
        const queues = await pub.listQueues();
        if ( !queues.contains( queueName ) ) {
            await pub.createQueue( queueName );
        }
    }

    async publish ( queueName, message ) {
        await this.ensureQueue( queueName );
        const pub = this.getPublisher();
        await pub.sendMessage( queueName, this.encodeMessage( message ) );
    }

}