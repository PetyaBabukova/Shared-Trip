const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    start: {
        type: String,
        required: [true, 'Starting point is required'],
        minlength: [4, 'Starting piont should be at least 4 characters long'],
    },

    end: {
        type: String,
        required: [true, 'End point is required'],
        minlength: [4, 'End piont should be at least 4 characters long'],
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
        match: [/^(http:\/\/|https:\/\/)/, 'Invalid URL'],
    },

    brand: {
        type: String,
        required: [true, 'Car Brand is required'],
        minlength: [4, 'Car brand should be at least 4 characters long']
    },

    seats: {
        type: Number,
        required: [true, 'Number of seats is required'],
        range: [[0, 4], 'The number of seats should be positive number, between 0 and 4'],
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        range: [[1, 50], 'The price could be from 1 to 50'],
    },


    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength:[5, 'Description should be at least 10 characters long'],
    },
    
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    join: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],



});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;