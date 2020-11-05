const AbstractSingleton = require('./abstractSingleton');
const redis = require('./redis');
const RSMQ = require('rsmq');

class Rsmq extends AbstractSingleton {
    _newInstance() {
        return new RSMQ({
            client: redis.getInstance()
        });
    }
}

module.exports = new Rsmq();