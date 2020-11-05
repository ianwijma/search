const AbstractSingleton = require('./abstractSingleton');
const { createClient } = require('redis');

class Redis extends AbstractSingleton {
    _newInstance() {
        return createClient({  });
    }
}

module.exports = new Redis();