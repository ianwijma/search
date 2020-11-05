const { createClient } = require('redis');

const AbstractSingleton = require('./abstractSingleton');

class Redis extends AbstractSingleton {
    _newInstance() {
        return createClient({  });
    }
}

module.exports = new Redis();