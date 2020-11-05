const RSMQWorker = require('rsmq-worker');
const rsmq = require('../singletons/rsmq');

module.exports = class Worker {

    constructor( queueName ) {
        this._client = new RSMQWorker( queueName, {
            timeout: 1000 * 60,
            rsmq: rsmq.getInstance()
        })
    }

    async ensureWorker () {
        return new Promise((resolve, reject) => {
            const { queue, queuename: qname } = this._client;
            queue.createQueue({ qname }, (err, resp) => {
                if ( err && err.name !== 'queueExists' ) {
                    reject( err );
                } else {
                    resolve( resp );
                }
            });
        });
    }

    async updateSettings ( settings ) {
        await this.ensureWorker();

        return new Promise((resolve, reject) => {
            const { queue, queuename: qname } = this._client;
            queue.setQueueAttributes({ qname, ...settings }, (err, resp) => {
                if ( err ) {
                    reject( err );
                } else {
                    resolve( resp );
                }
            });
        })
    }

    sendData ( data ) {
        return new Promise((resolve, reject) => {
            const dataString = this._encodeData( data );
            this._client.send( dataString, 0, (err, resp) => {
                if ( err ) {
                    reject( err );
                } else {
                    resolve( resp );
                }
            });
        });
    }

    receiveData ( promiseCallback ) {
        this._client.on( 'message', (dataString, next, dataId) => {
            const data = this._decodeData( dataString, dataId );
            promiseCallback( data )
                .then(() => next())
                .catch(err => {
                    console.error(err);
                    next( false );
                });
        });
    }

    _encodeData ( data ) {
        if ( typeof data === 'string' )
            return data;

        return JSON.stringify( data );
    }

    _decodeData ( dataString, dataId ) {
        let data;

        try {
            data = {
                // JSON.parse throws errors while parsing a non json string.
                data: JSON.parse(dataString),
                id: dataId
            };
        } catch ( err ) {
            data = {
                data: dataString,
                id: dataId
            };
        }

        return data;
    }

}