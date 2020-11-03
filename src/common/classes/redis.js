const { createClient } = require('redis');
const { promisify } = require('util');

module.exports = class Redis {

    _client = createClient()

    getClient () {
        return this._client;
    }

    getMulti () {
        return this._client.multi();
    }

    constructor() {
        [
            'get',
            'set',
            'incr',
            'decr',
            'publish',
        ].forEach(method => {
            const client = this.getClient();
            this[method] = promisify( client[method] ).bind( client );
        });
    }

}