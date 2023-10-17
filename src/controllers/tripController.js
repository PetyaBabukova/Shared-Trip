const router = require('express').Router();
const tripManager = require('../managers/tripManager');
let {isAuth} = require('../middlewares/authMiddleware')

router.get('/',  async (req, res) => {
    try {
        await tripManager.getAll();
        res.render('trips/shared-trips', );
    } catch (error) {
        res.status(404).render('home', { error: 'Failed to fetch trips.' });
    }
});

router.get('/create', isAuth, (req, res) => {
    try {
        res.render('trips/create', );

    } catch (error) {
        res.status(404).render('home', { error: 'Failed to get Add trips page.' });
    }
});

router.post('/create', isAuth, async (req, res) => {

    const tripData = {
        ...req.body,
        owner: req.user._id
    }

    try {
        await tripManager.create(tripData)
        res.redirect('/trips', )

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

        let availableSeats = trip.seats - trip.join.length

        let isAvailableSeats = availableSeats>0
        

        if (!trip) {
            res.status(404).send("trip not found");
            return;
        }

        let joined = [];
        trip.join.forEach(x => {
            joined.push(x._id.toString());
        });



        let hasJoined = joined.includes(req.user?._id.toString());
        let isAnyJoined = trip.join.length>0
        const isOwner = req.user?._id.toString() === trip.owner._id.toString();
        const isLogged = Boolean(req.user);

        res.render('trips/details', { ...trip, isOwner, isLogged, hasJoined, isAnyJoined, availableSeats, isAvailableSeats, mates:trip.join,  });

    } catch (error) {
        res.status(500).send('An error occurred while retrieving trip details.');
        console.log(error);
    }
});


router.get('/:tripId/edit', isAuth, async (req, res) => {
    const tripId = req.params.tripId;

    try {
        const trip = await tripManager.getOne(tripId).lean();
        res.render('trips/edit', { ...trip, })

    } catch (error) {
        res.render('home', { error: 'Edit trip Edit page failed' })
    }
});

router.post('/:tripId/edit', isAuth, async (req, res) => {
    const tripId = req.params.tripId;
    const tripData = req.body

    try {
        const trip = await tripManager.edit(tripId, tripData);
        res.redirect(`/trips/${tripId}/details`, );
    } catch (error) {
        res.render('trips/edit', { error: 'Unable to update trip', ...tripData })
    }

});

router.get('/:tripId/delete', async (req, res) => {

    if(!req.user){
        res.redirect('/users/login')
    } else{

    try {
        const tripId = req.params.tripId;
        await tripManager.delete(tripId);
        res.redirect('/trips', )

    } catch (error) {
        res.redirect(`/trips/${tripId}/details`, { error: 'Unsuccessful deletion' })
    }
}
})

router.get('/:tripId/join', isAuth, async (req, res) => {
    const tripId = req.params.tripId;
    const user = req.user;
    const trip = await tripManager.getOne(tripId).lean();

    const isOwner = req.user?._id.toString() === trip.owner._id.toString();
    const isLogged = Boolean(req.user);
    // console.log(isLogged);

    if (isLogged && !isOwner) {
        try {
            await tripManager.join(tripId, user._id);
            res.redirect(`/trips/${tripId}/details`);
        } catch (err) {

            console.log(err);
            res.render('trips/details', {
                ...trip,
                error: 'You cannot join',
                isOwner,
                isLogged,
            });
        }
    } else {
        res.redirect(`/trips/${tripId}/details`);
    }
});

module.exports = router;