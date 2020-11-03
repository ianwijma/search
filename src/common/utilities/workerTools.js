const RSMQWorker = require('rsmq-worker');

class WorkerTools {

    getWorker ( name, options = {} ) {
        return new RSMQWorker( RSMQWorker, options);
    }

    sendData ( worker, data ) {
        const dataString = this._encodeData( data );
        worker.send( dataString );
    }

    receiveData ( worker, promiseCallback ) {
        worker.on('message', (dataString, next, dataId) => {
            const data = this._decodeData( dataString, dataId );
            promiseCallback( data )
                .then(() => next())
                .catch(err => {
                    console.error('[ERROR]', err);
                    next();
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