const express=require('express');
const router= express.Router();
const getMessages= require("../controllers/message")
const verifyJWT= require('../middlewares/verifyJWT')


router.get('/:recipientId', verifyJWT, getMessages)

module.exports=router;