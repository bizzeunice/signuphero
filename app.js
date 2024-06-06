

//JSHint esversion:6 
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", (req, res) => {
    let firstname = req.body.fname;
    let lastname = req.body.lname;
    let email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    let jsondata = JSON.stringify(data);
    const dc = 'us13'; // Replace 'USX' with your actual data center prefix
    const listId = 'd722819631';
    let url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}`;
    let options = {
        method: "POST",
        auth: "eunice1:435ac291237ec61ddccd9122e00ff331-us13"
    };

    let request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/sucess.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        let responseData = '';
        response.on("data", (chunk) => {
            responseData += chunk;
        });

        response.on("end", () => {
            console.log(JSON.parse(responseData));
        });
    });

    request.write(jsondata);
    request.end();
});


app.post("/failure", (req,res)=>{
    res.redirect("/")
});
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on Port 8300');
});


// // API key
// // 436ac291237ec61ddccd9122e00ff331-us13
// //Audience id
// // d722819631