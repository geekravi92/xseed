const path = require('path');
const assert = require('assert');
const mongoose = require('mongoose');
const config = require('konphyg')(path.join(__dirname, "/../config"))('all');
const { User } = require('./../models/User');



describe("XSEED Education", () => {
    before(() => {
        // connect to mongodb
        const connectionString = `${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
        mongoose.connect(connectionString);
    })

    describe("Test User Model", () => {
        it("Should create a new user", (done) => {
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
                    assert(res.id === "ravi")
                    assert(res.email === "jj")
                    assert(typeof res.addresses === "object")
                    done();
                })
                .catch(err => done(err));
        });

        it("should give duplicate error", (done) => {
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
                    done("This should not happen");
                })
                .catch(err => done());
        });

        it("should delete the user", (done) => {
            User.findOneAndRemove({ id: "ravi" })
                .exec()
                .then(res => {
                    done();
                })
                .catch(err => done(err.message));
        });

        it("should give required field error", (done) => {
            const user = new User({
                id: "ravi",
                email: "jj",
                age: 26,
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
                    done("This should not happen");
                })
                .catch(err => {
                    assert(err.message === "User validation failed: name: Path `name` is required.")
                    done();
                });
        });
    });
})
