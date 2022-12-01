# QR Code Lead Generator

**Author: ChrisOtudero**

> QR Code Lead Generator is a Node.js app. You can build a mailing list for your business
> using either a QR Code (mobile marketing), web form, or both with:

- Twilio SendGrid Inbound Parse Webhook integration.

- Mailchimp API integration (could be any autoresponder service API).

- MySQL database integration.

## About QR Code Lead Generator

---

QR Code Lead Generator uses QR Code to load the email client on the prospect's smartphone with a ready-to-send email message. All the prospect needs to do is scan the QR Code and simply press the send button in the email client on their smartphone.

On pressing send in the email client:

1. The prospect's email address (the "from" field data) is captured.
2. The marketing campaign keyword in the email subject field is captured.
3. The short text in the message body is captured.
4. A new record with the captured data is inserted into your local MySQL database.
5. A new contact is added to your Mailchimp mailing list (this could be any autoresponder service API).

Still using a web form? No worries! Your web form can integrate with QR Code Lead Generator. All you need to do is add the action attribute to your form element, make the attribute point to the "/web form" route in the app.js file, and use the "POST" method.

## Prerequisites

---

- Node.js on your dev machine.
- MySQL database installed in your dev environment. You must create two tables--see help and resources below for the MySQL query code to create the tables.
- Mailchimp account with at least one email list.
- Twilio SendGrid account.
- A smartphone with QR Code reader capability.

## Quick Start

---

1. Create a project folder.
2. Copy/download the files/folder in this GitHub repository into your project folder.
3. Install Node.js if you don't already have it on your dev machine.
4. Open Windows Powershell, or the relevant console on your dev machine.
5. Navigate to the project folder. Based on your OS and the project-folder location, type the following commands in your dev machine terminal/console:
   - Windows: `cd c:\project-folder`
   - Mac/Linux/Unix: `cd ~/project-folder`
6. Type the commands below in order:

```js
 npm init -y // This command will initialize the Node.js App environment.

  npm install // This command will install dependencies.
```

7. Create MySQL database tables. You will need two tables:
   1. **Email Client Table:** This table holds the data from the email client submission.
   2. **Web Form Table:** This table holds the data from the web form submission.
      - See the code to create the two MySQL tables in the help and resources section below.
8. Enter your MySQL database credentials.
9. Enter your Mailchimp API credentials.
10. Visit Twilio SendGrid to set up your "Inbound Parse Webhook"--see the help and resources section below.
11. Read the Twilio SendGrid "Setting Up The Inbound Parse Webhook" document--see the help and resources section below.
12. Visit Twilio QR Code Builder to create your email QR Code--see the help and resources section below.
13. Test your app:
    - Scan the QR Code with your smartphone to make your email client pop up with a ready-to-send email message. Send the email.
    - Go to your web form, complete it, and submit.
14. Check your MySQL database for the insertion of a new record.
15. Check your Mailchimp mailing list for a new contact.
16. Rinse, repeat, and kick it forward.

## Help and resources

---

[Sign-in/Sign-up at Twilio SendGrid](https://signup.sendgrid.com/ "Sign-in/Sign-up at Twilio SendGrid")

[Setting Up The Twilio SendGrid Inbound Parse Webhook](https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook "Setting Up The Inbound Parse Webhook")

[Twilio QR Code Builder](https://server-1424-dev.twil.io/index.html "Twilio QR Code Builder")

[Download Node.js](https://nodejs.org/en/download/ "Download Node.js")

[Mailchimp Help](https://Mailchimp.com/help/ "Mailchimp Help")

[Connect with me](https://github.com/ChrisOtudero "Connect with me")

### Code to create the MySQL tables

You can change the parameters and fields used in the code below based on your use case. However, they must match the parameters in the "POST" routes that handle the email client and web form submissions respectively in the app.js file. Replace <MSQL_TABLE_NAME> with your MySQL database table name.

#### **Email Client Table**

```sql
CREATE TABLE `<MSQL_TABLE_NAME>` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dbName` varchar(100) NOT NULL,
  `dbEmail` varchar(100) NOT NULL,
  `dbSenderIP` varchar(100) NOT NULL,
  `dbSubject` varchar(100) NOT NULL,
  `dbEmailBody` varchar(100) NOT NULL,
  `dbSpamScore` varchar(100) NOT NULL,
  `dbEmailSPF` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### **Web Form Table**

```sql
CREATE TABLE `<MSQL_TABLE_NAME>` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fName` varchar(100) NOT NULL,
  `lName` varchar(100) NOT NULL,
  `cEmail` varchar(100) NOT NULL,
  `eMessage` varchar(100) NOT NULL,
  `ip` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Contributing

---

I welcome contributions. If you have suggestions for optimization, open a pull request and be sure to include a detailed description of your contribution and relevant code comments (if you are contributing code). This will help to not only understand your rationale but to also update this README.md document.

Follow these steps to contribute:

1. Fork the project.
2. Create a branch.
3. Commit changes.
4. Push to the branch.
5. Open a pull request.

Happy coding!

## Version

---

1.0.0

## License

---

MIT License

Copyright (c) [2022] [ChrisOtudero]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
