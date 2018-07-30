const path = require('path');
const mongoose = require('mongoose');
const config = require('konphyg')(path.join(__dirname, "config"))('all');
const { User } = require('./models/User');

// connect to mongodb
const connectionString = `${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
mongoose.connect(connectionString);

// create User instance
const user = new User({
    id: "ravi",
    email: "jj",
    age: 26,
    name: "Arvind Jaiswal",
    addresses: [
        {
            city: "Azamgarh",
            state: "UP"
        }
    ],
    dateOfBirth: new Date('01/05/1992')
})

// save to Mongodb
user.save()
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err.message));