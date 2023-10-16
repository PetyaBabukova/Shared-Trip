const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    start: {
        type: String,
        required: [true, 'Starting point is required'],
        // minlength: 2,
    },

    end: {
        type: String,
        required: [true, 'End point is required'],
        // minlength: 2,
    },

    date: {
        type: String,
        required: [true, 'Date is required'],
        // minlength: 2,
    },

    time: {
        type: String,
        required: [true, 'Time is requird'],
        // minlength: 2,
    },

    image: {
        type: String,
        required: [true, 'Image Url is required'],
        // match: [/^https?:\/\//, 'Invalid URL'],
    },

    brand: {
        type: String,
        required: [true, 'Car Brand is required'],
    },

    seats: {
        type: Number,
        required: [true, 'Number of seats is required']
    },

    price: {
        type: Number,
        required: [true, 'Price is required']
    },


    description: {
        type: String,
        required: [true, 'Description is required'],
        // minlength:5,
        // maxLength: 50
    },
    
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    votes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],



});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;