const mongoose=require('mongoose');


mongoose.connect('mongodb+srv://user3:user3@cluster0.pthum.mongodb.net/InvoiceApp?retryWrites=true&w=majority',{useNewUrlParser:true},(err)=>{
    if(err){
        console.error(err);
    }
    else {
        console.log("MongoDB Connection successful")
    }
})

require('./invoice.model')