const express= require('express');
const router= express.Router();
const {login, register, profile, logout}= require("../controllers/auth");
const verifyJWT= require('../middlewares/verifyJWT')

router.post('/register', register );
router.get('/profile', verifyJWT, profile)
router.post('/login', login);
router.get('/logout', logout);


module.exports=router;