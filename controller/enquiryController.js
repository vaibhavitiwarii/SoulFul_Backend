const nodemailer = require('nodemailer');
const Enquiry = require('../models/enquiryModel');

const COMPANY_EMAIL = 'soulfulindia01tours@gmail.com';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

const sendEnquiryEmail = async (req, res) => {
  const {
    name,
    mobile,
    email,
    checkInDate,
    checkOutDate,
    adults,
    children,
    hotelCategory,
    message,
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: COMPANY_EMAIL,
    subject: 'New Travel Enquiry – Soulful India Tour',
    html: `
      <h2>New Travel Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Check-in Date:</strong> ${checkInDate}</p>
      <p><strong>Check-out Date:</strong> ${checkOutDate}</p>
      <p><strong>Number of Adults:</strong> ${adults}</p>
      <p><strong>Number of Children:</strong> ${children || '0'}</p>
      <p><strong>Hotel Category:</strong> ${hotelCategory || 'Not specified'}</p>
      <p><strong>Message:</strong> ${message || 'No message'}</p>
    `,
  };

  try {
    await Enquiry.create({
      name,
      email,
      mobile,
      message,
      date: new Date(),
      isRead: false
    });
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send enquiry' });
  }
};

module.exports = {
  sendEnquiryEmail,
};
