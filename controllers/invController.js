const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Invoice=mongoose.model('Invoice')
const sgMail = require('@sendgrid/mail')
require('dotenv').config()

router.get('/',(req,res)=>{
    res.render('./invoice/addOrEdit')
})

//to display all tasks
router.get('/list',(req,res)=>{
    Invoice.find((err,docs)=>{
        if(!err){
            res.render("./invoice/list",{
                list:docs.map(doc=>doc.toJSON()),
            })
        }
        else{
            console.log("Error in retrieving data")
        }
    })
})





//insertion
router.post('/',(req,res)=>{
        insertData(req,res)       
})

//updation
router.post('/update',(req,res)=>{
    updateData(req,res) 
})






function updateData(req,res){
    Invoice.findOneAndUpdate({ _id: req.body._id}, req.body , { new:true } , (err,doc) => 
    {
        if(!err)
            {res.redirect("/invoice/list")
            console.log("successfully updated")}
        else{
            console.log("Error in retrieving data")
        }
    }
    )}





function insertData(req,res){

    var invoice=new Invoice();
    invoice.mail= req.body.mail
    invoice.wrkHrs=req.body.workHrs;
    invoice.wrkExp=req.body.workExp;
    invoice.mat=req.body.materials;
    invoice.lab=req.body.labour;
    invoice.nt=req.body.note;
    invoice.status ="Unpaid";
    invoice.date=Date.now();

    var sum=0;
    sum += (invoice.wrkHrs * 500)

    switch (invoice.mat.toLowerCase()) {
        case 'laptop':
            sum += 20000
            break;
        case 'desktop':
            sum += 30000
            break;
    }
    switch (invoice.wrkExp.toLowerCase()) {
        case 'transportation':
            sum += 200
            break;
        case 'house rent':
            sum += 3000
            break;

        case 'both':
            sum += 3200
            break;
    }
    switch (invoice.lab.toLowerCase()) {
        case 'online':
            sum += 1000;
            break;    
        case 'offline':
            sum += 2000;
            break;
    }
    invoice.total=sum;
    invoice.save((err,doc)=>{
        if(!err){
            res.redirect('/invoice')
        }
        else{
            console.log("Error during insertion")
        }})


    invoice.due = new Date(invoice.date);
    invoice.due.setDate(invoice.due.getDate() + 5);

    payWithin = Math.ceil((invoice.due - invoice.date)*0.000000011574)
    invoice.dueDays=payWithin
    
}





router.get('/:id',(req,res)=>{
    Invoice.findById(req.params.id, (err,docs)=>{
        if(!err){
            res.render("invoice/status",{
                invoice : docs
            })
        }
        else{
            console.log("Error in retrieving data")
        }
    }).lean()
})

//deletion of record
router.get('/delete/:id',(req,res)=>{
    Invoice.findByIdAndDelete(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/invoice/list')
            
        }
        else{
            console.log("Error")
        }
    })
})


//sending invoice as mail

router.get('/sendmail/:id',(req,res)=>{
    Invoice.findById(req.params.id, (err,docs)=>{
        if(!err){
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
              to: `${docs.mail}`, // Change to your recipient
              from: 'nihalnrasiya@gmail.com', // Change to your verified sender
              subject: 'Invoice',
              text: 'Invoice Due',
              html: `<table style="border:1px solid black">
              <thead>
                  <tr>
                      <th>Working Hours</th>
                      <th>Work Expenses</th>
                      <th>Materials</th>
                      <th>Labor</th>
                      <th>Total</th>
                      <th>Status</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>${docs.wrkHrs}</td>            
                      <td>${docs.wrkExp}</td>
                      <td>${docs.mat}</td>
                      <td>${docs.lab}</td>
                      <td>${docs.total}</td>
                      <td><a><b>${docs.status}</b></a></td>
                      </tr>
              </tbody>
                   </table> <br>
                   Invoice is due ${docs.due}`,
            }
            sgMail
              .send(msg)
              .then(() => {
                console.log('Email sent')
              })
              .catch((error) => {
                console.error(error)
              })
        
            
        }
        else{
            console.log("Error in retrieving data" + err)
        }
    }).lean()
    res.redirect('/invoice/list')
})






module.exports=router;