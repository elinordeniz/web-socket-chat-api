const mongoose= require('mongoose');
const bcrypt= require('bcrypt')


const UserSchema= new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required:[true, "Please provide a username"]
    },
    password:{
        type: String,
        required:[true, "Please provide a password"]
    }
}, {timestamps:true})

//middleware
UserSchema.pre('save', async function(){
        this.password= await bcrypt.hash(this.password, 10)
    })

const UserModel=mongoose.model('User', UserSchema);


module.exports= UserModel;