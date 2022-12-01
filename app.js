/*
************************************************************************************
Project Title: QR Code Lead Generator

Discription: This project is a Node.js app. You can build a mailing list for your business
using either a QR Code (mobile marketing), web form, or both with:
- Twilio SendGrid Inbound Parse Webhook integration.
- Mailchimp API integration (could be any autoresponder service API).
- MySQL database integration.

Author: ChrisOtudero
Version: 1.0.0
License: This project is licensed under the MIT License
*************************************************************************************
*/

const express = require("express");
const multer = require("multer");
const https = require("https");
const path = require("path");
const MySQL = require("MySQL");
const upload = multer();
const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Connect to your MySQL database.
const con = MySQL.createConnection({
  // Replace "localhost" with your host name.
  host: "localhost",
  // Replace "root" with your database username.
  user: "root",
  // Replace "" with your database password.
  password: "",
  // Replace "databaseName" with your database Name.
  database: "databaseName",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected successfully !");
});

// App root.
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/subscribe.html"));
});

/*
The code block below is the post route that executes the insertion/update of a record
in the MySQL database. It also updates a Mailchimp mailing list with a new subscriber.
It handles the incoming POST request from the Twilio SendGrid webhook.
Twilio SendGrid Webhook parses the email data sent from a mail client, then 
makes a POST request to this Node.js app. 
You'll need to provide the host address of this app to the Twilio SendGrid Webhook.
*/
app.post("/email-parse", upload.none(), (req, res) => {
  const fromEmailStr = req.body.from;

  /*
There is an issue with email servers regarding the way they format the "from" email address.
Some email servers use the "example@domain.com" format while others use the "John Doe <example@domain.com>" format. 
This latter format creates an error message for API servers that are set up to 
strictly accept a properly formatted email address. 
To get around this issue, you can employ one of two measures (and possibly others):
1. Create code that checks the email format and extracts just the email "from" 
field value from the client request payload using Regular Expression (RegEx), then store it 
in a variable. 
2. Another method is to extract the "from" field email data from the value of 
the "envelope" property included in the POST request payload, then store it in a variable. 
For example, const fromEmail = req.body.envelope.from. The method below uses RegEx.
*/
  const regex = /<(.*)>/g;
  const fromEmailRegx1 = regex.exec(fromEmailStr);
  const fromEmailRegx2 = fromEmailRegx1[1];

  /* 
  Update MySQL database. It updates the MySQL database with extracted data.
  Store the "req" body data that have been parsed in the "dbdata variable."
 */
  const dbdata = req.body;

  const dbName = fromEmailRegx2;
  const dbEmail = fromEmailRegx2;
  const dbSubject = dbdata.subject;
  const dbEmailBody = dbdata.text;
  const dbSenderIP = dbdata.sender_ip;
  const dbSpamScore = dbdata.spam_score;
  const dbEmailSPF = dbdata.SPF;

  /*
  The code block to insert a record into the MySQL database.
  Replace <MSQL_TABLE_NAME> with your MySQL database table name.
 */
  const sql = `INSERT INTO <MSQL_TABLE_NAME> (dbName, dbEmail, dbSenderIP, dbSubject, dbEmailBody, dbSpamScore, dbEmailSPF, created_at) VALUES ("${dbName}", "${dbEmail}", "${dbSenderIP}", "${dbSubject}", "${dbEmailBody}", "${dbSpamScore}", "${dbEmailSPF}", NOW())`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(
      "1 record inserted! " + "result parameter: " + JSON.stringify(result)
    );
  });

  // Invoke Mailchimp API endpoint to update a mailing list in a specified Mailchimp account.
  const listdata = req.body;

  const ldName = fromEmailRegx2;
  const ldEmail = fromEmailRegx2;
  const ldSubject = listdata.subject;
  const ldEmailBody = listdata.text;
  const ldSenderIP = listdata.sender_ip;
  const ldSpamScore = listdata.spam_score;
  const ldEmailSPF = listdata.SPF;

  const data = {
    members: [
      {
        email_address: ldEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: ldSubject,
          LNAME: ldEmailBody,
        },
      },
    ],
  };

  const jsonStr = JSON.stringify(data);
  /*
  Add your server location (Date Center (DC) ) to the URL.
  Replace <DATA_CENTER> with your account data center value.
  Replace <LIST_ID> with your account list ID.
  */
  const url = "https://<DATA_CENTER>.api.mailchimp.com/3.0/lists/<LIST_ID>";

  // Replace the <API_KEY> with your account API Key.
  const options = {
    method: "POST",
    auth: "<API_KEY>",
  };

  // Make the request.
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.on("error", (e) => {
    console.error(e);
  });

  request.write(jsonStr);
  request.end();

  return res.status(200).send();
});

/*
Web form submission route. Handler code block for incoming post request from 
subscribe.html webform.
*/
app.post("/webform", upload.none(), (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const wfData = req.body;
  const fName = wfData.fname;
  const lName = wfData.lname;
  const cEmail = wfData.contactEmail;
  const eMessage = wfData.emailMessage;

  wfDataJSONStr = JSON.stringify(wfData);

  /*
  The code block to insert a record into the MySQL database.
  Replace <MSQL_TABLE_NAME> with your MySQL database table name.
 */
  const sql = `INSERT INTO <MSQL_TABLE_NAME> (fName, lName, cEmail, eMessage, ip, created_at) VALUES ("${fName}", "${lName}", "${cEmail}", "${eMessage}", "${ip}", NOW())`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted!");
  });

  // Invoke Mailchimp API. It updates a mailing list in a specified Mailchimp account.
  const data = {
    members: [
      {
        email_address: cEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonStr = JSON.stringify(data);

  /*
  Add your server location (Date Center (DC) ) to the URL.
  Replace <DATA_CENTER> with your account data center value.
  URL Format: "https://us15.api.mailchimp.com/3.0/lists/mf4jua9nft"
  Replace <LIST_ID> with your account list ID.
  Liast ID format: mf4jua9nft

  */
  const url = "https://<DATA_CENTER>.api.mailchimp.com/3.0/lists/<LIST_ID>";

  const options = {
    method: "POST",
    // Replace the <API_KEY> with your account API Key.
    auth: "<API_KEY>",
  };

  // Make the request.
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, "public/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "public/fail.html"));
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.on("error", (e) => {
    console.error(e);
  });

  request.write(jsonStr);
  request.end();
});

/*
***************************************************************************************
TODO: Chatbot integration.
Code block to handle the route for chatbot form submission.
***************************************************************************************
*/

app.listen(3000, console.log("Express app listening on port 3000."));
