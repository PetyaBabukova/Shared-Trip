const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Email is required'],
        // minLength:10
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        // minLength: 4
    },
    
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Gender is required'],
        // minLength: 4
    },

    history: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }

});

userSchema.virtual('repeatPassword')
    .set(function (value) {
        if (this.password !== value) {
            throw new Error('Password missmatch')
        }
    });

    //hash password
    userSchema.pre('save', async function () {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash
    });

const User = mongoose.model('User', userSchema);

module.exports = User;