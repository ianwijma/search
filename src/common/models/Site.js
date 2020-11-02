const { Schema, model } = require('mongoose');
const { String } = Schema;

const name = 'Site';
const schema = new Schema({
    hostname: String,
}, { timestamps: true });

schema.methods.findByUrl = ( url, cb ) => {
    const { hostname } = new URL( url );
    return model( name ).find({ hostname }, cb);
}

module.exports = model( name, schema );