const { connect } = require('mongoose');

class Database {

    ensureConnection () {
        if ( !this.connected ) {
            connect('mongodb://localhost/search-tmp-dev', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            this.connected = true;
        }
    }

}

module.exports = new Database();