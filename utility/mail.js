const nodemailer = require('nodemailer');
const catchErrAsync = require('./catchAsync');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mail = async (options) => {
  // 1. Transporter yaratish yani mail dasturi bilan bizi dasturni ortasida koprik qurish

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //2. Mailni nastroyka qilish

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  //3. mailni jonatish

  await transport.sendMail(mailOptions);
};

// mail({
//   from: 'ibragimovmamurjon19@gmail.com',
//   to: 'kalandarovjamshid01@gmail.com',
//   subject: 'Xat keldi',
//   text: 'Assalomu alekum Jamshidbek sizni 8-mart bilan tabriklaymiz va sizga 50 mln yutuq sovgamiz bor kelib olib ketin',
// });

module.exports = mail;
