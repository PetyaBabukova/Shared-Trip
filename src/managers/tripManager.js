const Trip = require('../models/Trip');

exports.create = (TripData) => Trip.create(TripData);

exports.getAll = () => Trip.find().lean().populate('owner');

exports.getOne = (TripId) => Trip.findById(TripId).populate('owner').populate('join');

exports.edit = (TripId, TripData) => Trip.findByIdAndUpdate(TripId, TripData);

exports.delete = (TripId,) => Trip.findByIdAndDelete(TripId);

exports.join = async (TripId, userId) => {
    const trip = await Trip.findById(TripId);

    if (!trip.join.includes(userId.toString())) {
        trip.join.push(userId);
        await trip.save();
    }
    return trip;
};

exports.getAllOwnTrips = async (userId) => {
    const ownTrips = await Trip.find({owner: userId}).populate('owner').lean();
    return ownTrips;
};
