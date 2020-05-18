var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var monk = require('monk');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
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
  var data={
     username:req.body.username,
     email:req.body.email,
     password:cryptr.encrypt(req.body.password)
    // password:req.body.password
   }
  signup.insert(data, function(err,docs){
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
 router.post('/postlogin', function(req,res){
  
  var email1 = req.body.email;

  signup.find({'email':req.body.email},function(err,data){
  var password2 = cryptr.decrypt(data[0].password);
  var password1 = req.body.password;
  delete data[0].password;
  //console.log(data[0]);
  req.session.user = data[0];
  if(password1==password2){
    res.sendStatus(200);
  }
  else{
    res.sendStatus(500);
  }
  });


//------------------------------------otpemail--------------------------------------------------//

router.post('/postforgot', function(req,res){
  var email = req.body.email;
  var newpassword = randomstring.generate(7);
  
  signup.update({"email":email},{$set:{"password":newpassword}});

  const transporter = nodemailer.createTransport({
     service: 'gmail',
     host:'smtp.gmail.com',
     port: 465,
     secure: true,
  auth: {
    user: 'padalapavan27@gmail.com',
    pass: 'pavan2589'
  },
  tls:
  {rejectUnauthorized:false}


  });

  var mailOptions = {
    from: 'padalapavan16@gmail.com',
    to: req.body.email,
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
   if(req.session && req.session.user){
    console.log(req.session.user);
    res.locals.user = req.session.user
    res.render('form');
  }
  else{
    req.session.reset();
    res.redirect('/');
}
});


/* home logout. */
router.get('/logout', function(req,res){
   req.session.reset();
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


router.post('/postbirthday', function(req,res){
  /*var options={
    method:'POST',
    url:'http://google.com/api/v4/?api_key="---key---"&method=sms&message='+newpassword+',&to=&sender=ADITYA' 
    };
  request(options,function(error,response,body){
    if(err){
      console.log(err);
    }
    else{
      console.log(body);
    }
    });
*/
  
  //console.log(req.body);
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      host:'smtp.gmail.com',
      port:465,
      secure:true,
    auth: {
      user: 'padalapavan27@gmail.com',
      pass: 'pavan2589'
     },
    tls:
    {rejectUnauthorized:false}

    });

    var mailOptions = {
      from: 'padalapavan16@gmail.com',
      to: req.body.email,
      subject: 'Birthday Wishes',
      text: 'Hi' + req.body.name + 'Happy Birthday '
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } 
      else {
        console.log('Email sent');
        res.send(info);
      }
    });



var data={
    name:req.body.name,
    mobile:req.body.mobile,
    email:req.body.email,
    dob:moment(req.body.dob).format('DD-MM-YYYY')
    } 
  birth.insert(data,function(err,docs){
    if(err){
      console.log(err)
    }
   else{
      res.send(docs)
      var Date = moment().format('DD-MM-YYYY');
      console.log(Date);
}
})
   });

/*if(dob==Date){
  birth.insert(req.body,function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      res.send(docs);
    }
   })

 }
else if(dob!==Date){
  birth.insert(req.body,function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      res.send(docs);
}
})
});*/
/*else(dob==!Date){
    birth.insert(req.body,function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      res.send(docs);
}
}

})

*/

  //var bdate = moment(req.body.dob).format('DD-MM-YYYY');
  //console.log(bdate);

  // var Time = moment().format('hh:mm:ss:a');
  // console.log(Time);
  //if(bdate==Date){

module.exports = router;