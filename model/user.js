import mongoose from "mongoose";


const userSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,  
    },
    role: {
        type: String,
        enum: ['user', 'admin'] ,
        default: 'user'
      }

})

const User = mongoose.model("User", userSchema);

export default User;