const Trip = require('../models/Trip');
const User = require('../models/User');

exports.create = (TripData) => Trip.create(TripData);

exports.getAll = () => Trip.find().lean().populate('owner');

exports.getOne = (TripId) => Trip.findById(TripId).populate('owner').populate('join');

exports.edit = (TripId, TripData) => Trip.findByIdAndUpdate(TripId, TripData);

exports.delete = (TripId,) => Trip.findByIdAndDelete(TripId);

// exports.join = async (tripId, userId) => {
//     const trip = await Trip.findById(tripId);
//     // const user = await User.findById(userId);

//     if (!trip.join.includes(userId.toString())) {
//         trip.join.push(userId);
//         await trip.save();
//     };

//     if(!user.history.includes(tripId)){
//         user.history.push(tripId);
//         await user.save()
//     };

//     return trip;
// };


exports.join = async (tripId, userId) => {
    console.log(`Attempting to join user ${userId} to trip ${tripId}`);

    const trip = await Trip.findById(tripId);
    const user = await User.findById(userId);

    if (!trip) {
        console.error(`Trip with ID ${tripId} not found`);
        throw new Error("Trip not found");
    }

    if (!user) {
        console.error(`User with ID ${userId} not found`);
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

