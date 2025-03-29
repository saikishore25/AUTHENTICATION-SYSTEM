import mongoose from "mongoose";


const connectDB = async()=>{

    try{

        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Conected to Database Successfully");

    }

    catch(error){

        console.log("Error Connecting to Database");
        process.exit(1);


    }

} 

export default connectDB;
