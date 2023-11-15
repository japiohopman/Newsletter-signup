//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const https = require ("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){

    const firstName = req.body.Fname;
    const lastName = req.body.Lname;
    const email = req.body.Email;
    
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/4493be3a31";

    const options = {
        method: "POST",
        auth: "oost1:64c94dc9fcdf74d3113450f0eac819a7-us21"
    };



    const request = https.request(url, options, function(response) {
        let chunks = [];


        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on("end", function() {
            const responseData = Buffer.concat(chunks);
            console.log(JSON.parse(responseData));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
console.log("server running on port 3000");
});

