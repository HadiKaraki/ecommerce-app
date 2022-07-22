// PASSPORT-LOCAL-MONGOOSE SCHEMA DATABASE (STORING USER ACCOUNTS)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const passportLocalMongoose = require('passport-local-mongoose');

const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema({
    admin: {
        type: Boolean
    },
    title: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
}, opts);

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.findAndValidate = async function(email, password) {
    const foundUser = await this.findOne({ email });
    if (foundUser) {
        const isValid = await bcrypt.compare(password, foundUser.password);
        return isValid ? foundUser : false;
    }
}

UserSchema.statics.findByName = async function(username) {
    const account = await this.findOne({ username });
    return account;
}

UserSchema.statics.updateUsername = async function(oldFname, newFname) {
    await this.updateOne({ username: oldFname }, { username: newFname });
}

UserSchema.statics.findByID = async function(_id) {
    const account = await this.findById(_id);
    return account;
}

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('EcommerceUsers', UserSchema);