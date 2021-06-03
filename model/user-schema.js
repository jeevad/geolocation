var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    cust_code: String,
    location: {
        type: { type: String },
        coordinates: [Number],
    }
});
UserSchema.index({location: '2dsphere' });

module.exports = mongoose.model('user', UserSchema, 'Users');