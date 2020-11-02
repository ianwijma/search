const { connect } = require('mongoose');

module.exports = class Database {

    static ensureConnection () {
        if ( !this.connected ) {
            connect('mongodb://localhost/search.tmp.dev', {
                useNewUrlParser: true,
            });
            this.connected = true;
        }
    }

}