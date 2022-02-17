const mongoose=require('mongoose');


const invoiceSchema=new mongoose.Schema({
    wrkHrs:{
        type:Number
    },
    
    wrkExp:{
        type:String
    },
    mat:{
        type:String
    },
    lab:{
        type:String
    },
    status:{
        type:String
    },
    total:{
        type:Number
    },
    mail:{
        type:String
    },
    date:{
        type:Date
    },
    due:{
        type:Date
    },
    dueDays:{
        type:Number
    },
    nt:{
        type:String
    }
})


mongoose.model('Invoice',invoiceSchema)