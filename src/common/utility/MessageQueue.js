const RSMQWorker = require('rsmq-worker');

module.exports = class MessageQueue {

    async subscribe ( queueName, promiseCallback ) {
        const worker = this.getPublisher( queueName );

        worker.on('error', function( err, msg ){
            console.log( "ERROR", err, msg.id );
        });
        worker.on('timeout', function( msg ){
            console.log( "TIMEOUT", msg.id, msg.rc );
        });

        worker.on('message', async ( message, next, id ) => {
            console.log(message);
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

    getPublisher ( queueName ) {
        return new RSMQWorker( queueName, {
            autostart: true,
            timeout: 0,
        });
    }

    async publish ( queueName, message ) {
        const pub = this.getPublisher( queueName );
        await pub.send( this.encodeMessage( message ) );
    }

}