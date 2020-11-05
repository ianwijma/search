const { connect } = require('mongoose');

module.exports = class Runner {

    async start () {
        await this.setup();
        this.run();
    }

    ensureDatabase() {
        if ( !this.connected ) {
            connect('mongodb://localhost/search-tmp-dev', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            this.connected = true;
        }
    }

    setup() {}
    run() {}

}