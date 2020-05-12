var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var monk = require('monk');
var moment=require('moment');
var db = monk('localhost:27017/thub');
var col=db.get('user');
var signup=db.get('signup');
var birth=db.get('birth');
//------------------------------------------------login--------------------------------------------------------------------//

router.get('/', function(req, res) {
  res.render('login');
});


//forgot password
 router.get('/forgot',function(req,res){
 	res.render('forgot');
 });

//signup data into back end
router.post('/postsignup', function(req,res){

  signup.insert(req.body, function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs); 	
      res.send(docs);
    }
  })
});

//login data match
router.post('/postlogin',function(req,res){
	var email1=req.body.email;
	var password1=req.body.password;
	signup.findOne({"email":email1,"password":password1},function(err,docs){
		if (docs){
			res.send(docs);
		}
		else{
		    res.sendstatus(500);
		}
	})
})

//------------------------------------otpemail--------------------------------------------------//

router.post('/postforgot', function(req,res){
  var email = req.body.email;
  var newpassword = randomstring.generate(7);
  
  signup.update({"email":email},{$set:{"password":newpassword}});

  var transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
      port: 465,
     secure: true,
  auth: {
    user: 'padalapavan27@gmail.com',
    pass: 'pavan2589'
  }
  });

  var mailOptions = {
    from: 'padala pavan',
    to: 'req.body.email',
    subject: 'OTP',
    text: 'Your OTP is'+newpassword
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent');
      res.send(info);
    }
  });
});
//------------------------------------------form-----------------------------------------------//

/* GET home page. */
router.get('/home', function(req, res) {
  res.render('form');
});


/* home logout. */
router.get('/logout', function(req,res){
  res.redirect('/');
});

//list get from database 
router.get('/getuser',function(req,res){
	col.find({},function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			//console.log(docs);
			res.send(docs);
		}
	})
});

//data going to table
router.post('/postuser',function(req,res){
	//console.log(req.body);
	col.insert(req.body,function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			//console.log(docs);
			res.send(docs);
		}
	})
});

router.delete('/deleteuser:id',function(req,res){
		//console.log(req.params.id);
		col.remove({"_id":req.params.id},function(err,docs){
			if(err){
				console.log(err);
            }
            else{
            	//console.log(docs);
            	res.send(docs);
            }
		})
	});


//for edit of the list
router.put('/edituser:id',function(req,res){
	//console.log(req.params.id);
	console.log(req.body);
	col.update({"_id":req.params.id},{$set:req.body},function(err,docs){
		if(err){
				console.log(err);
            }
        else{
            	//console.log(docs);
            	res.send(docs);
            }
	})
})

//---------------------------------------------------------birthday--------------------------------------------------------------//

router.get("/birthday",function(req,res){
  res.render('birthday');
});


//list get from database 
router.get('/getbirth',function(req,res){
  birth.find({},function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  })
});



router.post('/postbirthday',function(req,res){
 // console.log(req.body);
 var data={
  name:req.body.name,
  mobile:req.body.mobile,
  email:req.body.email,
  dob:req.body.dob
 }
  birth.insert(data,function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  


    var bdate=moment(req.body.dob).format('DD-MM-YYYY');
    console.log(bdate);
    var time=moment().format('hh:mm:ss:a');//12:00:00:a
    //console.log(time);
    var date=moment().format('DD-MM-YYYY');
    console.log(date);
    if(date==bdate){
      res.send(birth.dob);
      console.log(birth.dob);
    }
    else{
      console.log(error);
    }
  })


});


     //    var transporter = nodemailer.createTransport({
     //    service: 'gmail',
     //     host: 'smtp.gmail.com',
     //     port: 465,
     //     secure: true,
     //    auth: {
     //      user: 'padalapavan16@gmail.com',
     //      pass: 'dadmomsis'
     //    }
     //    });

     //    var mailOptions = {
     //      from: 'Padala pavan',
     //      to: req.body.email,
     //      subject: 'Birthday wishes',
     //      text: 'hi'+req.body.name+'happy birthday'
     //    };

     //    transporter.sendMail(mailOptions, function(error, info){
     //      if (error) {
     //        console.log(error);
     //      } else {
     //        console.log('Email sent');
     //        res.send(info);
     //      }
     //    });
     //  //}
     // // });*/


    
        
    
module.exports = router;