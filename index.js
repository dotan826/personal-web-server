const express = require('express');
const app = express();
const port = process.env.PORT || 3080;
var nodemailer = require('nodemailer');
const path = require("path"); // for path methods

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DEVELOPMENT ONLY
const cors = require("cors"); // FOR TESTING / DEVELOPMENT !
const corsOptions = { // FOR TESTING / DEVELOPMENT !
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions)); // FOR TESTING / DEVELOPMENT !
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DEVELOPMENT ONLY

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Check if the request made from Secure (HTTPS) url - if not, it redirect the client browser to HTTPS !
app.use(function(req,resp,next){
  if (req.headers['x-forwarded-proto'] == 'http') {
      return resp.redirect(301, 'https://' + req.headers.host + '/');
  } else {
      return next();
  }
});

app.use(express.static(path.join(__dirname, "build")));

// JUST FOR TESTING !!!!!!!!!!!!!!!!!!
// app.get("/s", (req,res)=>{
//   res.write("environment : " + process.env.NODE_ENV + " <<>> ");
//   res.write("protocol : " + req.protocol + " <<>> ");
//   res.write("secure : " + req.secure + " <<>> ");
//   res.write("hostname is " + req.hostname + " <<>> ");
//   res.write("url is " + req.originalUrl + " <<>> ");
//   res.end();
//   // res.redirect("/index.html");
// });

// Gets message details and send a mail
app.post('/contact', (req, res)=>{
  // res.send("We received " + req.body.name);
  console.log("someone called Contact !"); // testing log

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: '', // Enter here our Email Address to send emails
      pass: '' // Enter here our Email Password so we can send emails
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  var mailOptions = {
    from: 'dido43231@gmail.com',
    to: 'dido43231@gmail.com',
    subject: 'פנייה מהאתר שלי ע"י ' + req.body.name,
    text: (
      "שם : " + req.body.name + "\n" + 
      "טלפון : " + req.body.phone + "\n" + 
      "דואר אלקטרוני : " + req.body.mail + "\n" + 
      "הודעה : " + req.body.msg
    )
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.send(false); // if there was error
      // console.log(error);
    } else {
      res.send(true); // if email send success
      // console.log('Email sent: ' + info.response);
    }
  });

});

// Redirect all unknown urls back to main page !
app.get('*', function(req, res) {
    res.redirect("/index.html");
});

// Start server listening
app.listen(port, () => {
  console.log(`We are running at http://localhost:${port} !`);
})




