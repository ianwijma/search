class RedisTools {

    publishData ( redisClient, channel, data ) {
        const dataString = this._encodeData( data );
        console.log(`[${channel}]`, 'Publishing data to subscribers, bytes:', dataString.length);
        redisClient.publish( channel, dataString );
    }

    subscribeData ( redisClient, subscribeChannel, promiseCallback ) {
        console.log(`[${subscribeChannel}]`, 'Subscribing to publishers');
        redisClient.on('message', (channel, dataString) => {
            console.log(`[${subscribeChannel}]`, 'publishers data received');
            if (channel !== subscribeChannel) return;

            const data = this._decodeData( dataString );
            promiseCallback( data )
                .catch(err => console.error('[ERROR]', err));
        });

        redisClient.subscribe(subscribeChannel);
    }

    _encodeData ( data ) {
        if ( typeof data === 'string' )
            return data;

        return JSON.stringify( data );
    }

    _decodeData ( dataString ) {
        let data;

        try {
            data = {
                // JSON.parse throws errors while parsing a non json string.
                data: JSON.parse(dataString),
            };
        } catch ( err ) {
            data = {
                data: dataString,
            };
        }

        return data;
    }

}

module.exports = new RedisTools();