const { promisify } = require('util');
const { list: commandList } = require('redis-commands');

const redis = require('../singletons/redis');

class RedisHashList {

    constructor({ redis, hashListName }) {
        this.redis = redis;
        this.hashListName = redis.getKey( hashListName );
    }

    set ( key, value ) {
        return this.redis.hset( this.hashListName, key, value );
    }

    get ( key ) {
        return this.redis.hget( this.hashListName, key );
    }

    exists ( key ) {
        return this.redis.hexists( this.hashListName, key );
    }

    incr ( key ) {
        return this.redis.hincrby( this.hashListName, key, 1 );
    }

    decr ( key ) {
        return this.redis.hincrby( this.hashListName, key, -1 );
    }

}

module.exports = class Redis {

    _prefix = 'tds';

    _setupMethods() {
        commandList.forEach(method => {
            this[method] = promisify(this._client[method]).bind(this._client);
        });
    }

    constructor() {
        this._client = redis.getInstance();
        this._setupMethods();
    }

    getKey ( suffix ) {
        return `${this._prefix}:${suffix}`;
    }

    getHashList ( hashListName ) {
        return new RedisHashList({ redis: this, hashListName })
    }

}