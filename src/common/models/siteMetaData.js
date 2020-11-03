const { Schema, model } = require('mongoose');
const { String, Object } = Schema;

const name = 'SiteMetaData';
const schema = new Schema({
    hostname: 'string',
    pathname: 'string',
    search: 'string',
    meta: 'object',
});

module.exports = model( name, schema );