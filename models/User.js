const mongoose = require('mongoose');
const { createModels } = require('./../common/helper');

const Address = ` ​ ​​ ​type​ ​Address​ ​{
    ​ ​​ ​​ ​​ ​city:​ ​String,
    ​ ​​ ​​ ​​ ​state:​ ​String
    ​ ​​ ​} `;

const User = `
    ​ ​​ ​type​ ​User​ ​@model​ ​{
    ​ ​​ ​​ ​​ ​id:​ ​String!​ ​@unique,
    ​ ​​ ​​ ​​ ​email:​ ​String!​ ​@unique ,​ ​​ ​​ ​​ ​name:​ ​String!,
    ​ ​​ ​​ ​​ ​age:​ ​Int,
    ​ ​​ ​​ ​​ ​addresses:​ ​[Address],
    ​ ​​ ​​ ​​ ​dateOfBirth:​ ​Date
    ​ ​​ ​}
    `;

const Models = createModels(Address, User);
module.exports = {
    User: mongoose.model('User', Models['User'])
};
