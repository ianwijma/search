const { Schema, model } = require('mongoose');
const { String } = Schema;

const name = 'SitePage';
const schema = new Schema({
    hostname: String,
    pathname: String,
}, { timestamps: true });

schema.methods.findByUrl = ( url, cb ) => {
    const { hostname, pathname } = new URL( url );
    return model( name ).find({ hostname, pathname }, cb);
}

module.exports = model( name, schema );