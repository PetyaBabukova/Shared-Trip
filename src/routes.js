const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const tripController = require('./controllers/tripController');



router.use(homeController);
router.use( '/users', userController);
router.use( '/trips', tripController);


router.get('*', (req, res)=>{
    res.redirect('/404')
});

module.exports = router;