const mongoose=require('mongoose');
const ApplicationSchema= new mongoose.Schema({
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    jobId:{type:mongoose.Schema.Types.ObjectId,ref:"Job", required:true},
    status:{type:String,enum:["Applied","Accepted","Rejected"],default:"Applied"},
    appliedAt:{type:Date,default:Date.now}
});
const Application= mongoose.model("Application", ApplicationSchema);
module.exports= Application;