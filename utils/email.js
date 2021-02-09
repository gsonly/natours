const pug = require('pug')
const nodemailer = require('nodemailer')
const { htmlToText } = require('html-to-text')
const {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_FROM,
  IN_PROD,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
} = require('../config')

module.exports = class {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `"Gladson Sethiel" <${EMAIL_FROM}>`
  }

  newTransport() {
    if (IN_PROD) {
      return nodemailer.createTransport({
        // TODO: setup sendgrid (this doesnt work yet)
        service: 'SendGrid',
        auth: {
          user: SENDGRID_USERNAME,
          pass: SENDGRID_PASSWORD,
        },
      })
    }
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    )
    const text = htmlToText(html)
    const mailOpts = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text,
    }
    await this.newTransport().sendMail(mailOpts)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Family!')
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token only valid for 10 minutes'
    )
  }
}
