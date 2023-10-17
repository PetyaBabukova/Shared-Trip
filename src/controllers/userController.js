const router = require('express').Router();
const userManager = require('../managers/userManager');
const { TOKEN_KEY } = require('../config/config');
const { getErrorMessage } = require('../utils/errorHelpers');
const mongoose = require('mongoose');
const User = require('../models/User');
const Trip = require('../models/Trip');

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const token = await userManager.login(email, password);

        res.cookie(TOKEN_KEY, token);
        res.redirect('/');

    } catch (err) {
        console.log(err);
        res.render('users/login', { error: getErrorMessage(err) });
    }
});


router.get('/register', (req, res) => {
    res.render('users/register')
});

router.post('/register', async (req, res) => {
    const { email, password, repeatPassword, gender, history } = req.body;


    try {
        const token = await userManager.register({ email, password, repeatPassword, gender, history });
        res.cookie(TOKEN_KEY, token);
        res.redirect('/');

    } catch (err) {
        res.render('users/register', { error: getErrorMessage(err), email });
    }

});

router.get('/logout', (req, res) => {
    res.clearCookie('token');

    res.redirect('/');
});

router.get('/profile', async (req, res) => {
    try {
        const userInfo = await userManager.getUserTrips(req.user?._id)
        const user = await userManager.getUser(req.user._id) 
        let isMale = user.gender == 'male'

        res.render('users/profile', {userInfo, email:req.user.email, count:userInfo.length, isMale });
    } catch (err) {
        res.render('home', { error: getErrorMessage(err) });

    }

})


module.exports = router;