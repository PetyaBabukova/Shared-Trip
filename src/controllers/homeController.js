const router = require('express').Router();
const creaturesManager = require('../managers/tripManager')

router.get('/', async (req, res) => {

    // await creaturesManager.getAll()
    //     .then((animals) => {

            res.render('home');
            
        // }).catch(err=> console.log(err))



    });

    router.get('/404', (req, res)=>{
        res.render('home/404')
    })
    
    module.exports = router;

