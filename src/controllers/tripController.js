const User = require('../models/User')

const router = require('express').Router();
const tripManager = require('../managers/tripManager');

router.get('/',  async (req, res) => {
    try {
        const trips = await tripManager.getAll();
        console.log(trips);
        res.render('trips/shared-trips', { trips });
    } catch (error) {
        res.status(404).render('home', { error: 'Failed to fetch trips.' });
    }
});

router.get('/create', (req, res) => {
    try {
        res.render('trips/create');

    } catch (error) {
        res.status(404).render('home', { error: 'Failed to get Add trips page.' });
    }
});

router.post('/create', async (req, res) => {

    const tripData = {
        ...req.body,
        owner: req.user._id
    }

    try {
        await tripManager.create(tripData)
        res.redirect('/trips')

    } catch (error) {

        res.render('trips/create', {
            error: 'Trip creation failed',
            data: tripData
        });
    }
});

router.get('/:tripId/details', async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const trip = await tripManager.getOne(tripId).lean();
        
        let count = trip.votes.length;

        if (!trip) {
            res.status(404).send("trip not found");
            return;
        }

        let voted = [];
        trip.votes.forEach(x => {
            voted.push(x._id.toString());
        });

        let hasVoted = voted.includes(req.user?._id.toString());
        let isAnyVote = trip.votes.length>0
        const isOwner = req.user?._id.toString() === trip.owner._id.toString();
        const isLogged = Boolean(req.user);

        res.render('trips/details', { ...trip, count, isOwner, isLogged, hasVoted, isAnyVote });

    } catch (error) {
        res.status(500).send('An error occurred while retrieving trip details.');
        console.log(error);
    }
});


router.get('/:tripId/edit', async (req, res) => {
    const tripId = req.params.tripId;

    try {
        const trip = await tripManager.getOne(tripId).lean();
        res.render('trips/edit', { ...trip })

    } catch (error) {
        res.render('home', { error: 'Edit trip Edit page failed' })
    }
});

router.post('/:tripId/edit', async (req, res) => {
    const tripId = req.params.tripId;
    const tripData = req.body

    try {
        const trip = await tripManager.edit(tripId, tripData);
        res.redirect(`/trips/${tripId}/details`);
    } catch (error) {
        res.render('trips/edit', { error: 'Unable to update trip', ...tripData })
    }

});

router.get('/:tripId/delete', async (req, res) => {

    try {
        const tripId = req.params.tripId;
        await tripManager.delete(tripId);
        res.redirect('/trips')

    } catch (error) {
        res.redirect(`/trips/${tripId}/details`, { error: 'Unsuccessful deletion' })
    }

})

// router.get('/:tripId/vote', async (req, res) => {
//     const tripId = req.params.tripId;
//     const user = req.user;
//     const trip = await tripManager.getOne(tripId).lean();

//     const isOwner = req.user?._id.toString() === trip.owner._id.toString();
//     const isLogged = Boolean(req.user);
//     // console.log(isLogged);

//     if (isLogged && !isOwner) {
//         try {
//             await tripManager.vote(tripId, user._id);
//             res.redirect(`/trips/${tripId}/details`);
//         } catch (err) {

//             console.log(err);
//             res.render('trips/details', {
//                 ...trip,
//                 error: 'You cannot vote',
//                 isOwner,
//                 isLogged,
//             });
//         }
//     } else {
//         res.redirect(`/trips/${tripId}/details`);
//     }
// });

module.exports = router;