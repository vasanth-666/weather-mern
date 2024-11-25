const mongoose=require('mongoose');

const Weatherschema=new mongoose.Schema({
    city : {
        type:String,
        required:true
    },
    country : {
        type:String,
        required:true
    },
    date : {
        type:String,
        required:true
    },
    weather : {
        type:String,
        required:true
    },
    temperature : {
        type:String,
        required:true
    },
    description : {
        type:String,
        required:true
    },
},{ timestamps: true });

const Weathermodel=mongoose.model("Weatherforecast",Weatherschema);
module.exports=Weathermodel;