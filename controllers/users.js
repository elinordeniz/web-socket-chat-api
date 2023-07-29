const User= require('../models/User');
const {StatusCodes}= require('http-status-codes')

const getAllUsers = async (req, res)=>{

    const allUsers= await User.find({},{"_id":1,username:1})
        if(allUsers){
            res.status(StatusCodes.OK).json(allUsers);
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": "No users found"})
        }

}


module.exports= getAllUsers;
