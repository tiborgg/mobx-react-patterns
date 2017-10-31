const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./server/db.json');
const lodashId = require('lodash-id');

const db = low(adapter);
db._.mixin(lodashId);

db.defaults({
    pictures: []
}).write();

module.exports = db;