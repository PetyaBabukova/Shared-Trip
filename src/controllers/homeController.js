const router = require('express').Router();


router.get('/', async (req, res) => {
        // if(req.user){
        //     console.log(req.user.email);
        // }
            res.render('home' );
            
    });

    router.get('/404', (req, res)=>{
        res.render('home/404')
    })
    
    module.exports = router;
