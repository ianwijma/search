const { Schema, model } = require('mongoose');
const { String, Object } = Schema;

const name = 'SiteMetaData';
const schema = new Schema({
    hostname: String,
    pathname: String,
    search: String,
    meta: Object,
});

module.exports = model( name, schema );