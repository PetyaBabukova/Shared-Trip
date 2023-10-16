const Trip = require('../models/Trip');

exports.create = (TripData) => Trip.create(TripData);

exports.getAll = () => Trip.find().lean().populate('owner');

exports.getOne = (TripId) => Trip.findById(TripId).populate('owner').populate('votes');

exports.edit = (TripId, TripData) => Trip.findByIdAndUpdate(TripId, TripData);

exports.delete = (TripId,) => Trip.findByIdAndDelete(TripId);

exports.vote = async (TripId, userId) => {
    const Trip = await Trip.findById(TripId);

    if (!Trip.votes.includes(userId.toString())) {
        Trip.votes.push(userId);
        await Trip.save();
    }
    return Trip;
};

exports.getAllOwnTrips = async (userId) => {
    const ownTrips = await Trip.find({owner: userId}).populate('owner').lean();
    return ownTrips;
};
