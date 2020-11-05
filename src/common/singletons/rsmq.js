const RSMQ = require('rsmq');

const AbstractSingleton = require('./abstractSingleton');
const redis = require('./redis');

class Rsmq extends AbstractSingleton {
    _newInstance() {
        return new RSMQ({
            client: redis.getInstance()
        });
    }
}

module.exports = new Rsmq();