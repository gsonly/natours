const nodemailer = require('nodemailer')
const { EMAIL_HOST, EMAIL_PASS, EMAIL_PORT, EMAIL_USER } = require('../config')

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })

  const info = await transporter.sendMail({
    from: '"Gladson Sethiel" <gladson.sethiel@gmail.com>',
    to,
    subject,
    text,
    // html: "<b>Hello world?</b>",
  })

  console.log('Message sent %s', info.messageId)
}

module.exports = sendEmail
