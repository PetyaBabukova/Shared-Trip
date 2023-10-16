const router = require('express').Router();
const userManager = require('../managers/userManager');
const tripManager = require('../managers/tripManager');
const { TOKEN_KEY } = require('../config/config');
const { getErrorMessage } = require('../utils/errorHelpers');
const Trip = require('../models/Trip');

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const token = await userManager.login(email, password);

        res.cookie(TOKEN_KEY, token);
        res.render('home', {email} );

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
        console.log(err);
    }

});

router.get('/logout', (req, res) => {
    res.clearCookie('token');

    res.redirect('/');
});

// router.get('/profile', async (req, res) =>{

//     await tripManager.getAllOwnCreatures(req.user._id)
//     .then(ownCreatures => {

//         res.render('users/profile', { ownCreatures: ownCreatures });
//     })
//     .catch(err => console.log(err));

        
    
// })






module.exports = router;