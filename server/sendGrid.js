require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key from environment variable
sgMail.setApiKey("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");

// Define the email message
const msg = {
  to: "srsuiuxdesign@gmail.com", // Use the recipient's email from the environment variable
  from: "ssharma33@student.ysu.edu" ,// Use the sender email from the environment variable
  subject: 'Hello from SendGrid',
  text: 'This is a test email sent using SendGrid!',
  html: '<strong>This is a test email sent using SendGrid!</strong>',
};

// Send the email
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent successfully!');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });
