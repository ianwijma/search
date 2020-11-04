const urlTools = require('./urlTools');
const { UPDATE_DIFFERENCE_MS } = require('../constants/misc');
const { PREFIX_HOSTNAME_PAGE_COUNTER, PREFIX_PAGE_UPDATED, PREFIX_PAGE_NANOID } = require('../constants/redis');
const { nanoid } = require('nanoid/async');

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

    _createKey( prefix, suffix ) {
        return `${prefix}:${suffix}`;
    }

    async createKey ( redis, prefix, suffix ) {
        let id = await this._getKeyId(redis, suffix);
        return this._createKey(prefix, id);
    }

    async _getKeyId(redis, suffix) {
        const idKey = this._createKey(PREFIX_PAGE_NANOID, suffix);

        let id = await redis.get(idKey);
        if (!id) {
            id = await nanoid();
            await redis.set(idKey, id);
        }

        return id;
    }

    async getHostnamePageCounter ( redis, hostname ) {
        const key = await this.createKey( redis, PREFIX_HOSTNAME_PAGE_COUNTER, hostname );
        return await redis.get( key ) || 0;
    }

    async increaseHostnamePageCounter ( redis, hostname ) {
        const key = await this.createKey( redis, PREFIX_HOSTNAME_PAGE_COUNTER, hostname );
        return await redis.incr( key );
    }

    async decreaseHostnamePageCounter ( redis, hostname ) {
        const key = await this.createKey( redis, PREFIX_HOSTNAME_PAGE_COUNTER, hostname );
        return await redis.decr( key );
    }

    async canQueuePage ( redis, hostname, pathname = '', search = '' ) {
        const url = urlTools.buildPlainUrl( hostname, pathname, search );
        const key = await this.createKey( redis, PREFIX_PAGE_UPDATED, url );
        const updateAtString = await redis.get( key );

        if ( !updateAtString ) return true; // No previous update found

        const updatedAt = new Date(updateAtString);
        const now = Date.now();
        return ( now - updatedAt ) > UPDATE_DIFFERENCE_MS;
    }

    async pageUpdated ( redis, hostname, pathname = '', search = '' ) {
        const url = urlTools.buildPlainUrl( hostname, pathname, search );
        const updateKey = await this.createKey( redis, PREFIX_PAGE_UPDATED, url );
        await redis.set( updateKey, Date.now() );
        await this.increaseHostnamePageCounter( redis, hostname );
    }

}

module.exports = new RedisTools();