const RSMQWorker = require('rsmq-worker');

class WorkerTools {

    getWorker ( name, options = {} ) {
        return new RSMQWorker( name, {
            ...options,
            autostart: true
        });
    }

    /**
     * @param worker
     * @returns {Promise<boolean>} True means it was created. False means it already exists.
     */
    async ensureWorker ( worker ) {
        return new Promise((resolve, reject) => {
            const { queue, queuename: qname } = worker;
            queue.createQueue({ qname }, (err, resp) => {
                err && err.name !== 'queueExists'
                    ? reject( err )
                    : resolve( !!resp );
            });
        });
    }

    async updateWorkerSettings ( worker, options ) {
        await this.ensureWorker( worker )

        const { queue, queuename } = worker;
        const update = {
            qname: queuename,
            ...options,
        };
        console.log(`[${queuename}]`, 'Updating worker settings, update:', update);
        // Documentation: https://github.com/smrchy/rsmq#setqueueattributesoptions-callback
        queue.setQueueAttributes(update, (err, resp) => {
            if ( err ) throw new Error( err );
            return resp;
        });
    }

    sendData ( worker, data ) {
        return new Promise((resolve, reject) => {
            const dataString = this._encodeData( data );
            console.log(`[${worker.queuename}]`, 'Sending data to worker, bytes:', dataString.length);
            worker.send( dataString, 0, (err, resp) => {
                err ? reject(err)
                    : resolve(resp);
            });
        })
    }

    receiveData ( worker, promiseCallback ) {
        console.log(`[${worker.queuename}]`, 'Listening for data');
        worker.on('message', (dataString, next, dataId) => {
            console.log(`[${worker.queuename}]`, 'Received data for worker');
            const data = this._decodeData( dataString, dataId );
            promiseCallback( data )
                .then(() => next())
                .catch(err => {
                    console.error(`[ERROR-${worker.queuename}]`, err);
                });
        });
    }

    createKey ( key, value ) {
        return `${key}::${value}`;
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

module.exports = new WorkerTools();