const Trip = require('../models/Trip');
const User = require('../models/User');

exports.create = (TripData) => Trip.create(TripData);

exports.getAll = () => Trip.find().lean().populate('owner');

exports.getOne = (TripId) => Trip.findById(TripId).populate('owner').populate('join');

exports.edit = (TripId, TripData) => Trip.findByIdAndUpdate(TripId, TripData);

exports.delete = (TripId,) => Trip.findByIdAndDelete(TripId);

exports.join = async (tripId, userId) => {

    const trip = await Trip.findById(tripId);
    const user = await User.findById(userId);

    if (!trip) {
        throw new Error("Trip not found");
    }

    if (!user) {
        throw new Error("User not found");
    }

    if (!trip.join.includes(userId.toString())) {
        trip.join.push(userId);
        await trip.save();
    }
    
    if (!user.history) {
        user.history = [];
    }

    if(!user.history.includes(tripId)){
        user.history.push(tripId);

        await user.save();
    }
    return trip;
};

