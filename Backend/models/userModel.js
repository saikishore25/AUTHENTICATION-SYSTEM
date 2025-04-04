import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    googleId:{  
        
        type: String,
        unique: true,
        sparse: true
    }, 
       
    email:{

        type: String,
        required: true,
        unique: true
    },

    password:{

        type: String,
        // required: true

    },

    name: {

        type: String,
        required: true
    
    },

    lastLogin:{

        type: Date,
        default: Date.now

    },


    isVerified:{

        type: Boolean,
        default: false

    },

    resetPasswordCode:{

        type: String
    },

    resetPasswordCodeExpires:{

        type: Date
    },

    verificationCode:{

        type: String
    },

    verificationCodeExpiresAt:{

        type: Date
    }


}, {timestamps:true});

const userModel = mongoose.model("User", userSchema);
export default userModel;